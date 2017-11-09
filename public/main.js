var d3 = require('d3');
var d3TimeFormat = require('d3-time-format');

var socket = io();
            
var pixelData;
var canvasContext, canvasBase;
var pixelSize = 7;
var pixelPadding = 1
var pixelTotalSize = pixelSize+pixelPadding;

var nextRuntime = 0;
tick();

var playlist = d3.select('#playlist').append('svg');

socket.on('config', function(config){
    console.log('config', config);
    nextRuntime = new Date(config.nextRuntime);
    buildPlaylist(config.songs);
    pixelData = preparePixelData(config.numPixels);
    createCanvas('#pixels');
    bindPixelData(pixelData);
    drawPixels();
});

socket.on('pixelData', function(data) {
    pixelData = data;
    //console.debug('time', new Date(), 'pixelData', pixelData);
    bindPixelData(pixelData);
    drawPixels();
});

socket.on('nextRuntime', function(data){
    nextRuntime = new Date(data);
});

document.querySelector('#playButton').addEventListener('click', function(){
    socket.emit('play');
});
document.querySelector('#stopButton').addEventListener('click', function(){
    socket.emit('stop');
});

function buildPlaylist(songs){

    //d3.select('#playlist > svg').remove();
    
    var rowHeight = 40;
    
    var listItems = playlist.selectAll('g')
        .data(songs)
        .enter()
        .append('g')
        .attr('transform', function(d, i) {
            return "translate(0," + (i+1) * rowHeight + ")";
        });
    
    //play/pause buttons
    listItems
        .append('text')
        .attr('class', 'play-pause-button')
        .text(function(d){
            return "►";
            //return "❚❚";
        })
        .on('click', function(d, i){
            socket.emit('setSong', i);
        });
    
    //duration rectangle
    listItems
        .append('rect')
        .attr('transform', function(d){
            return "translate(20,-15)";
        })
        .attr('height', 20)
        .attr('width', function(d){
            return d.duration * 50; //todo make this scale with svg width so longest song is full width
        });
    
    //song name
    listItems
        .append('text')
        .attr('x', 20)
        .text(function(d){
            return d.audioFile;
        });
    
    
        
    /*
    d3.select('#playlist').append('ol').selectAll('li')
        .data(songs)
        .enter()
        .append('li')
        .text(function(d){
            return d.audioFile;
        })
        .on('click', function(d, i){
            socket.emit('setSong', i);
        });
    */
}
 
function preparePixelData(numPixels){
    var pixelData = [];
    d3.range(numPixels).forEach(function(el) {
        pixelData.push(0);
    });
    return pixelData;
}

function createCanvas(selector){
    
    //remove canvas if it already exists (like if server restarted while browser was open)
    d3.select(selector).select('canvas').remove();

    var canvas = d3.select(selector)
        .append('canvas')
        .attr('width', pixelTotalSize*pixelData.length)
        .attr('height', pixelSize);

    canvasContext = canvas.node().getContext('2d');
    
    var customBase = document.createElement('custom');
    canvasBase = d3.select(customBase); // this is our svg replacement
}

function bindPixelData(data) {
    
    var join = canvasBase.selectAll('custom.rect')
        .data(data);

    var enterSel = join.enter()
        .append('custom')
        .attr('class', 'rect')
          .attr('x', function(d, i) {
            return pixelTotalSize*i;
          })
          .attr('y', function(d, i) {
            return 0;
          })
                .attr('width', 0)
                .attr('height', 0);

    join
        .merge(enterSel)
        .attr('width', pixelSize)
        .attr('height', pixelTotalSize)
        .attr('fillStyle', function(d, i) {
            return '#'+decimalToHex(d);;
        });

}

function drawPixels() {
    // clear canvas
    canvasContext.fillStyle = '#222222';
    canvasContext.fillRect(0, 0, pixelTotalSize*pixelData.length, pixelTotalSize);

    // draw each individual custom element with their properties
    var elements = canvasBase.selectAll('custom.rect') // this is the same as the join variable, but used here to draw
                
    elements.each(function(d,i) {
        // for each virtual/custom element...
        var node = d3.select(this);
        canvasContext.fillStyle = node.attr('fillStyle');
        canvasContext.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'))
    });
}

function tick(){
    var message = '';
    var now = new Date();
    var untilNext = nextRuntime - now;
    if(untilNext && untilNext >= 0){
        untilNext -= 1000;
        var totalSeconds = Math.round(untilNext/1000);
        var minutes = Math.floor(totalSeconds/60);
        if(minutes > 59){
            message = d3.timeFormat("%I:%M %p")(nextRuntime);    
            setTimeout(tick, 10 * 60 * 1000);
        }else{
            var seconds = totalSeconds%60;
            var secondsPadding = '';
            if(seconds < 10){
                secondsPadding = "0";
            }
            message = minutes+":"+secondsPadding+seconds;
            setTimeout(tick, 1000);
        }
        document.querySelector('#clock').innerHTML = message;
    }else{
        setTimeout(tick, 1000);
    }
}

function decimalToHex(d) {
  var hex = Number(d).toString(16);
  hex = "000000".substr(0, 6 - hex.length) + hex; 
  return hex;
}