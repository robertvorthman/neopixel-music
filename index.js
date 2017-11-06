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
var currentSong = 0;

//init neopixels
if(process.arch == 'arm'){
    ws281x.init(config.numPixels);
}
var pixelData = new Uint32Array(config.numPixels);


var trackPixelScales = [];

var audioPlayer; //audio player
var midiParser = createMidiParser(); //midi parser

var analyzedMidis = false;
loadSong(0, ()=>{
    console.log('finished analyzing '+config.songs.length+' songs.');
    
    //web socket events
    io.on('connection', function (socket) {
        console.log('Client Connected');
        socket.emit('config', config);
        socket.emit('Next Routine Time', interval.next());
        socket.on('play', play);
        socket.on('stop', stop);
    });
    
});

//cron schedule
var interval = parser.parseExpression(config.cronSchedule);
const emitter = new CronEmitter();
emitter.add(config.cronSchedule, config.cronName);
emitter.on(config.cronName, () => {

    var untilNext = new Date(interval.next()) - new Date(interval.prev());
    console.log('untilNext', untilNext);
    io.emit('untilNext', untilNext);
/*
    var next = new Date(interval.next());
    var now = new Date();

    console.log('fire cron, next:', next, 'now', now);
    
  io.emit('scheduling', {
    sent: now,
    next: next
  });
  */
});

function playbackReady(){
    console.log('Playback ready');
}

function loadSong(songIndex, callback){

    midiParser.on('fileLoaded', (midiParser)=>{
        console.log('Loaded file', config.songs[songIndex].midiFile, ', Tracks:',midiParser.tracks.length);
        
        //analyze all midis
        if(!analyzedMidis){
            analyzeMidiTracks(midiParser.tracks, songIndex);
            if(songIndex < config.songs.length - 1){
                loadSong(++songIndex);
            }else{
                analyzedMidis = true;
                callback && callback();
            }
        }else{
            midiParser.tempo = config.songs[songIndex].midiTempo;
            //console.log('Loaded midi, length: ',midiParser.getSongTime());
            playbackReady();
        }
        
    });
    midiParser.loadFile(config.audioPath+config.songs[songIndex].midiFile);
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
        var segmentSize = Math.floor(config.numPixels/d.length);
        config.songs[songIndex].trackOptions[i].segmentSize = segmentSize;
        var range = d3.range(0, config.numPixels, segmentSize);
        //console.log(config.trackOptions[i].name, 'segmentSize', segmentSize, 'range', range, 'domain', d);
        
        //store scale in global
        trackPixelScales[i] = d3.scaleOrdinal(range).domain(d);
        config.songs[songIndex].trackOptions[i].range = range;
        config.songs[songIndex].trackOptions[i].domain = d;
                
        //todo emit new config to client?
        rangeIndex += d.length+1;
    });
        
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

 

