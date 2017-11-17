var d3 = require('d3');
var d3TimeFormat = require('d3-time-format');

var socket = io();

var config;

var pixelData;
var canvasContext, canvasBase;
var pixelSize = 7;
var pixelPadding = 1
var pixelTotalSize = pixelSize+pixelPadding;

var currentSong;
var nextRuntime = 0;
tick();

var listItems, durationScale, playlist = d3.select('#playlist').append('svg');

socket.io.on('connect_error', function(error) {
    d3.select('#status-message').text('Disconnected');
});

socket.io.on('reconnect', function(event) {
    d3.select('#status-message').text('');
});



socket.on('config', function(d){
    config = d;
    if(typeof config.currentSong != 'undefined'){
        currentSong = config.currentSong;
    }
    console.log('config', config);
    nextRuntime = new Date(config.nextRuntime);
    buildPlaylist(config.songs);
    pixelData = preparePixelData(config.startPixel+config.numPixels);
    createCanvas('#pixels');
    bindPixelData(pixelData);
    drawPixels();
});

socket.on('pixelData', function(data) {
    pixelData = data.pixelData;
    bindPixelData(pixelData);
    drawPixels();
    
    //if client currentSong is different from server currentSong
    if(typeof data.currentSong != 'undefined' && currentSong != data.currentSong){
        currentSong = data.currentSong;
        config.songs.forEach(function(song, i){
            song.playing = (i == currentSong) ? true : false;
            song.percentRemaining = (i == currentSong) ? data.percentRemaining : 100;
        });
        updateListItems();
    } 
    
    //update remaining time
    if(typeof currentSong != 'undefined' && data.percentRemaining >= 0){
        config.songs[currentSong].percentRemaining = data.percentRemaining;
        updateRemainingTime();
    }
});

socket.on('nextRuntime', function(data){
    nextRuntime = new Date(data);
});

socket.on('endOfFile', function(i){
    currentSong = undefined;
    config.songs[i].percentRemaining = 100;
    config.songs[i].playing = false;
    updateListItems();
});
socket.on('play', function(i){
    currentSong = i;
    config.songs[currentSong].percentRemaining = 100;
    config.songs[i].playing = true;
    updateListItems();
});
socket.on('stop', function(i){
    currentSong = undefined;
    config.songs[i].percentRemaining = 100;
    config.songs[i].playing = false;
    updateListItems();
});

document.querySelector('#cancelButton').addEventListener('click', function(event){
    nextRuntime = 0;
    socket.emit('disableSchedulePlay');
    d3.select('#clock-container').classed('hidden', true);
});

function buildPlaylist(songs){
    
    var rowHeight = 40;
    var rectLeftOffset = 20;
    
    var bodyWidth = parseInt(d3.select('body').style('width'));
    
    var rectMaxWidth = bodyWidth - rectLeftOffset;
    
    d3.select('#playlist > svg')
        .attr('height', rowHeight*songs.length)
        .attr('width', bodyWidth);
    
    //delete old list items if server restarted while client open
    playlist.selectAll('g').remove();
    
    listItems = playlist.selectAll('g')
        .data(songs)
        .enter()
        .append('g');
    
    listItems
        .classed('playing', getListItemClass)
        .attr('transform', function(d, i) {        
            return "translate(0," + (((i+1) * rowHeight) - (rowHeight/2)) + ")";
        });
    
    //play/stop buttons
    listItems
        .append('text')
        .attr('class', 'play-stop-button')
        .text(getListItemButton)
        .on('click', function(d, i){
            if(d.playing){
                socket.emit('stop');
            }else{
                socket.emit('playSong', i);
            }
        });
    
    var maxSongDuration = d3.max(songs, function(d){
        return d.duration;
    });
    durationScale = d3.scaleLinear().domain([0,maxSongDuration]).range([0,rectMaxWidth]);
        
    //duration rectangle
    listItems
        .append('rect')
        .attr('transform', function(d){
            return "translate("+rectLeftOffset+",-15)";
        })
        .attr('height', 20)
        .attr('width', function(d){
            return durationScale(d.duration);
        });
    
    //song name
    listItems
        .append('text')
        .attr('x', 20)
        .text(function(d){
            var fileName = d.audioFile.replace(/\.[^/.]+$/, ""); //remove file extension
            return fileName;
        });
    
    //update playlist total duration
    var totalSeconds = d3.sum(songs, function(d){return d.duration});
        
    d3.select('#playlistDuration').text(d3.timeFormat('%-M:%S')(totalSeconds*1000));
}

function updateListItems(){

    //toggle play/stop button
    listItems.selectAll('.play-stop-button')
        .text(getListItemButton);
    
    //toggle class
    listItems
        .classed('playing', getListItemClass)
    
    //update progress bar
    listItems
        .selectAll('rect')
        .attr('width', function(d){
            return durationScale(d.duration);
        })
        .attr('x', function(d){
            return 0;
        });    
}

function updateRemainingTime(){
        
    listItems
        .filter(function(d,i){
            return i == currentSong;
        })
        .selectAll('rect')
        .attr('width', function(d){
            return durationScale(d.duration)*d.percentRemaining/100;
        })
        .attr('x', function(d){
            return durationScale(d.duration)*(100 - d.percentRemaining)/100;
        });
}

function getListItemButton(d, i){    
    if(d.playing){
        return "◼";
    }
    return "▶";
}

function getListItemClass(d, i){
    if(d.playing){
        return true;
    }
    return false;
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
            var hex = d3.color('#'+decimalToHex(d));
            var colorObject = d3.color('rgb('+hex[config.colorOrder[0].toLowerCase()]+','+hex[config.colorOrder[1].toLowerCase()]+','+hex[config.colorOrder[2].toLowerCase()]+')');
            var colorObject = colorObject.brighter(3);
            return colorObject.toString();
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
    if(untilNext >= 0){
        var totalSeconds = Math.round(untilNext/1000);
        var minutes = Math.floor(totalSeconds/60);
        if(minutes > 59){
            message = d3.timeFormat("%-I:%M %p")(nextRuntime);    
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
        d3.select('#clock-container').classed('hidden', false);
        document.querySelector('#clock').innerHTML = message;
    }else{
        document.querySelector('#clock').innerHTML = '';
        setTimeout(tick, 1000);
    }
}

function decimalToHex(d) {
  var hex = Number(d).toString(16);
  hex = "000000".substr(0, 6 - hex.length) + hex;
  return hex;
}