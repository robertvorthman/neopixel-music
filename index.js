//config file
var config = require('./config.js');

if(config.songs.length < 1){
    console.log('!!! Error !!!, no songs defined in config.js, config.songs is empty.');
    process.exit(0);
}

//midi parser
var MidiPlayer = require('midi-player-js');
//mp3 player
var player = require('play-sound')(opts = {})
//neopixels
var ws281x = false;
if(process.arch == 'arm'){
    var ws281x = require('rpi-ws281x-native');
}
const CronEmitter = require('cron-emitter');
var parser = require('cron-parser');
var d3 = require("d3");
var d3scaleChromatic = require("d3-scale-chromatic");
// Setup express server
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || config.port;

process.on('SIGINT', function () {
    //reset neopixels
    if(process.arch == 'arm'){
        ws281x.reset();
    }
    //terminate audio
    if(audioPlayer){
        audioPlayer.kill();
    }
    process.nextTick(function () { process.exit(0); });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

//state
var currentSong = config.songs.length - 1;

//init neopixels
if(process.arch == 'arm'){
    ws281x.init(config.numPixels);
}
var pixelData = new Uint32Array(config.numPixels);

var audioPlayer; //audio player
var midiParser = createMidiParser(); //midi parser
midiParser.on('fileLoaded', loadedSong);
midiParser.on('playing', (event)=>{

    if(midiParser.getSongPercentRemaining() <= 0){
        console.log('song ended');
        stop();
    }
    //TODO attach light fading here
});



var analyzedMidis = false;
loadSong(); //start loading each song, last to first and store track scale analyses

//cron schedule
const emitter = new CronEmitter();
emitter.add(config.cron, 'musicTime');
emitter.on('musicTime', () => {
    var interval = parser.parseExpression(config.cron);
    //var untilNext = new Date(interval.next()) - new Date(interval.prev());
    io.emit('nextRuntime', interval.next());
});

function setupComplete(){
    console.log('Setup Complete');
    //web socket events
    io.on('connection', function (socket) {
    
        console.log('Client Connected');
        var interval = parser.parseExpression(config.cron);
        config.nextRuntime = new Date(interval.next());
        socket.emit('config', config);
        socket.on('play', play);
        socket.on('stop', stop);
        socket.on('setSong', setSong);
    });
}

function setSong(index){
    
    console.log('isPlaying()', midiParser.isPlaying());
    
    if(currentSong != index){
        //new song, change song and play
        stop();
        currentSong = index;
        isPlaybackReady = false;
        loadSong();
    }else{
        //same song, restart
        stop();
        play();
    }
}

function loadSong(){
    midiParser.loadFile(config.audioPath+config.songs[currentSong].midiFile);
}

function loadedSong(midiParser){
    //analyze midi tracks, recursively load next song in reverse order so first song is ready to play
    if(!analyzedMidis){
        config.songs[currentSong].duration = midiParser.getSongTime();
        console.log('Analyze song', currentSong, config.songs[currentSong].midiFile, Math.round(config.songs[currentSong].duration)+' seconds');        
        analyzeMidi(midiParser, currentSong);
        if(currentSong > 0){
            //analyze the rest of the songs
            loadSong(--currentSong);
        }else{
            analyzedMidis = true;
            setupComplete();
            playbackReady();
        }
    }else{
        console.log('Loaded song', currentSong, config.songs[currentSong].midiFile, Math.round(midiParser.getSongTime())+' seconds');         
        playbackReady();
        play();
    }
}

function playbackReady(){
    isPlaybackReady = true;
    console.log('playbackReady');
}

// Initialize player and register event handler
function createMidiParser(){
    return new MidiPlayer.Player(function(event) {
        if(event.name == "Note off" || event.name == "Note on"){
            var trackOptions = config.songs[currentSong].trackOptions[event.track-1];
            if(trackOptions.show){
                var startPixel = trackOptions.scale(event.noteNumber);
                var endPixel = startPixel+trackOptions.segmentSize;
                var color = 0; //0 is black/off

                if(event.name == "Note on"){
                    var colorObject = d3.color(trackOptions.color);
                    var velocityColor = colorObject.darker((100-event.velocity)/100);
                    var color = rgb2Int(velocityColor.r, velocityColor.g, velocityColor.b);
                }
                
                setPixels(startPixel, endPixel, color);
            }
        } 
    });
}

function setPixels(startPixel, endPixel, color){
    for(var x = startPixel; x < endPixel; x++){
        pixelData[x] = color;
    }
    io.emit('pixelData', Array.from(pixelData));
    if(process.arch == 'arm'){
        ws281x.render(pixelData);
    }
}

function play(){

    if(!isPlaybackReady){
        console.log('!!!! PLAYBACK NOT READY !!!!');
        return;
    }

    var delay = 100;
    if(process.arch == 'arm'){
        delay = 800;
    }
    
    setTimeout(function(){
        config.songs[currentSong].midiStartAt && midiParser.skipToSeconds(config.songs[currentSong].midiStartAt);
        if(typeof config.songs[currentSong].midiTempo != 'undefined'){
            midiParser.tempo = config.songs[currentSong].midiTempo;
        }
        midiParser.play();
        console.log('Play midi', config.songs[currentSong].midiFile);
    }, delay);
    
    
    
    audioPlayer = player.play(config.audioPath+config.songs[currentSong].audioFile, function(err){
      if (err && !err.killed) throw err
    })
    console.log('Play audio', config.songs[currentSong].audioFile);
}

function stop(){
    midiParser.stop();
    midiParser.skipToTick(0);
    if(audioPlayer){
        audioPlayer.kill();
    }
    setPixels(0, config.numPixels-1, 0); //set all pixels black/off
    console.log('Stop');
}



function analyzeMidi(player, songIndex){

    var trackNests = [];
    var trackNotes = [];
    
    //create config trackOptions array if not defined
    if(typeof config.songs[songIndex].trackOptions == 'undefined'){
        config.songs[songIndex].trackOptions = [];
    }
        
    //group all notes by track
    player.tracks.forEach(function(track){
        trackNests.push(d3.nest()
            .key(function(d) { return d.name; })
            .key(function(d) { return d.noteNumber; }).sortKeys((a, b)=>{
                var numA = parseInt(a);
                var numB = parseInt(b);
                return numA - numB;
            })
            .entries(track.events))
    });
        
    //store which notes each track contains
    trackNests.forEach((trackNest, i)=>{
        
        //create trackOptions object if doesn't exist
        if(typeof config.songs[songIndex].trackOptions[i] == 'undefined'){
            config.songs[songIndex].trackOptions[i] = {
                name: 'Track'+(i+1),
                color: d3scaleChromatic.interpolateSpectral(((i+1)/(player.tracks.length))),
                show: true
            };
        }
    
        trackNotes[i] = [];
        trackNest.forEach((event)=>{
            if(event.key == "Note on"){
                event.values.forEach((noteNumber)=>{
                    trackNotes[i].push(parseInt(noteNumber.key));
                });
            }else if(event.key == "Sequence/Track Name"){
                var trackNameEvent = event.values[0].values[0];
                //store track instrument in config
                config.songs[songIndex].trackOptions[trackNameEvent.track-1].instrument = trackNameEvent.string;
            }
        });
    });
    
    //map the domain of possible notes to the neopixel segment range
    var rangeIndex = 0;
    trackNotes.forEach((notes, i)=>{

        var trackOptions = config.songs[songIndex].trackOptions[i];
    
        var segmentSize = Math.floor(config.numPixels/notes.length);
        trackOptions.segmentSize = segmentSize;
        
        var range = d3.range(0, config.numPixels, segmentSize);
        trackOptions.scale = d3.scaleOrdinal(range).domain(notes);
        trackOptions.range = trackOptions.scale.range();
        trackOptions.domain = trackOptions.scale.domain();
        
        rangeIndex += notes.length+1;
    });
        
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

 

