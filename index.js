//config file
var config = require('./config.js');
//midi parser
var MidiPlayer = require('midi-player-js');
//mp3 player
var player = require('play-sound')(opts = {})
//neopixels
var ws281x = false;
if(process.arch == 'arm'){
    var ws281x = require('rpi-ws281x-native');
}
// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || config.port;
//d3
var d3 = require("d3");

process.on('SIGINT', function () {
    if(process.arch == 'arm'){
        ws281x.reset();
    }
  if(audio){
        audio.kill();
    }
  process.nextTick(function () { process.exit(0); });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

if(process.arch == 'arm'){
    ws281x.init(config.numPixels);
}
var pixelData = new Uint32Array(config.numPixels);
var audio;
var trackNotes = [];
var trackPixelScales = [];

// Initialize player and register event handler
var Player = new MidiPlayer.Player(function(event) {
    //io.emit('midi', event);
    //console.log('event', event);
    if(event.name == "Note off" || event.name == "Note on"){
        var trackOptions = config.trackOptions[event.track-1];
        if(trackOptions.show){
            var scale = trackPixelScales[event.track-1];
            var startPixel = scale(event.noteNumber);
            var endPixel = startPixel+trackOptions.segmentSize;
            var color = rgb2Int(0,0,0);

            if(event.name == "Note on"){
                var colorObject = d3.color(trackOptions.color);
                var velocityColor = colorObject.darker((100-event.velocity)/100);
                var color = rgb2Int(velocityColor.r, velocityColor.g, velocityColor.b);
            }
        
            for(var x = startPixel; x < endPixel; x++){
                pixelData[x] = color;
            }
            io.emit('pixelData', Array.from(pixelData));
            if(process.arch == 'arm'){
				ws281x.render(pixelData);
			}
        }
        
        
    }
});



// Load a MIDI file
Player.loadFile(config.midiFile);
Player.tempo = config.midiTempo;
console.log('Total midi length ',Player.getSongTime());
analyzeTracks();

//web socket events
io.on('connection', function (socket) {
    console.log('Client Connected');
    config.tracks = Player.tracks;
    socket.emit('config', config);
    
    socket.on('play', function(){
        
        var delay = 100;
        if(process.arch == 'arm'){
            delay = 800;
        }
        
        setTimeout(function(){
            Player.play();
        }, delay);
        
        audio = player.play(config.mp3File, function(err){
          if (err && !err.killed) throw err
        })
        console.log('Play');
    });
    socket.on('stop', function(){
        Player.stop();
        Player.skipToTick(0);
        if(audio){
            audio.kill();
        }
        console.log('Stop');
    });
});

function analyzeTracks(){
    
    var trackNests = [];
    
    Player.tracks.forEach(function(track){
        trackNests.push(d3.nest()
            .key(function(d) { return d.name; })
            .key(function(d) { return d.noteNumber; }).sortKeys(d3.ascending)
            .entries(track.events))
    });
    
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
    
    var rangeIndex = 0;
    trackNotes.forEach((d, i)=>{
        var segmentSize = Math.floor(config.numPixels/d.length);
        config.trackOptions[i].segmentSize = segmentSize;
        var range = d3.range(0, config.numPixels, segmentSize);
        console.log(config.trackOptions[i].name, 'segmentSize', segmentSize, 'range', range, 'domain', d);
        trackPixelScales[i] = d3.scaleOrdinal(range).domain(d);
        rangeIndex += d.length+1;
    });
        
}

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

 

