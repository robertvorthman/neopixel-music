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


var trackPixelScales = [];

var audioPlayer; //audio player
var midiParser = createMidiParser(); //midi parser
midiParser.on('fileLoaded', loadedSong);

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

function playbackReady(){
    console.log('Playback ready');
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
    if(currentSong != index){
        currentSong = index;
        loadSong();
    }
}

function loadSong(){
    midiParser.loadFile(config.audioPath+config.songs[currentSong].midiFile);
}

function loadedSong(midiParser){
    //analyze all midis
    if(!analyzedMidis){
        analyzeMidiTracks(midiParser.tracks, currentSong);
        midiParser.tempo = config.songs[currentSong].midiTempo;
        console.log('Loaded song', currentSong, config.songs[currentSong].midiFile, midiParser.getSongTime());
        if(currentSong > 0){
            //analyze the rest of the songs
            loadSong(--currentSong);
        }else{
            analyzedMidis = true;
            
            playbackReady();
        }
    }else{        
        midiParser.tempo = config.songs[currentSong].midiTempo;
        //TODO call some function to indicate finished loading next song so that play() is not called before next song loaded
    }
}

// Initialize player and register event handler
function createMidiParser(){
    return new MidiPlayer.Player(function(event) {
        if(event.name == "Note off" || event.name == "Note on"){
            var trackOptions = config.songs[currentSong].trackOptions[event.track-1];
            if(trackOptions.show){
                var scale = trackPixelScales[event.track-1];
                var startPixel = scale(event.noteNumber);
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
    var delay = 100;
    if(process.arch == 'arm'){
        delay = 800;
    }
    
    setTimeout(function(){
        midiParser.skipToSeconds(config.songs[currentSong].midiStartAt);
        midiParser.tempo = config.songs[currentSong].midiTempo;
        midiParser.play();
    }, delay);
    
    audioPlayer = player.play(config.audioPath+config.songs[currentSong].mp3File, function(err){
      if (err && !err.killed) throw err
    })
    console.log('Play');
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



function analyzeMidiTracks(tracks, songIndex){

    var trackNests = [];
    var trackNotes = [];
    
    //group all notes by track
    tracks.forEach(function(track){
        trackNests.push(d3.nest()
            .key(function(d) { return d.name; })
            .key(function(d) { return d.noteNumber; }).sortKeys(d3.ascending)
            .entries(track.events))
    });
    
    //store which notes each track contains
    trackNests.forEach((trackNest, i)=>{
        trackNotes[i] = [];
        trackNest.forEach((event)=>{
            if(event.key == "Note on"){
                event.values.forEach((noteNumber)=>{
                    trackNotes[i].push(parseInt(noteNumber.key));
                });
            }
        });
    });
    
    //map the domain of possible notes to the neopixel segment range
    var rangeIndex = 0;
    trackNotes.forEach((d, i)=>{
        
        //create track options object if it does not exist
        if(i >= config.songs[songIndex].trackOptions.length){
            config.songs[songIndex].trackOptions[i] = {};
        }
        var trackOptions = config.songs[songIndex].trackOptions[i];
    
        var segmentSize = Math.floor(config.numPixels/d.length);
        trackOptions.segmentSize = segmentSize;
        var range = d3.range(0, config.numPixels, segmentSize);
        //console.log(trackOptions.name, 'segmentSize', segmentSize, 'range', range, 'domain', d);
        
        //store scale in global
        trackPixelScales[i] = d3.scaleOrdinal(range).domain(d);
        trackOptions.range = range;
        trackOptions.domain = d;

        rangeIndex += d.length+1;
    });
        
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

 

