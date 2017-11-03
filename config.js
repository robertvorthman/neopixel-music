var config = {
    numPixels: 144,
    midiFile: "audio/wizards edit 5.mid",
    midiTempo: 148.3, //148.3 is matched
    mp3File: "audio/wizards in winter.mp3",
    port: 3000,
    trackOptions: [
        {
            name: 'meta',
            color: 'gray',
            show: false
        },
        {
            name: 'bass1',
            color: 'white',
            show: true
        },
        {
            name: 'guitar1',
            color: 'green',
            show: true
        },
        {
            name: 'guitar2',
            color: 'green',
            show: true
        },
        {
            name: 'piano1',
            color: 'red',
            show: true
        },
        {
            name: 'piano2',
            color: 'red',
            show: true
        },
        {
            name: 'strings',
            color: 'red',
            show: true
        },
        {
            name: 'glockenspiel',
            color: 'blue',
            show: true
        },
        {
            name: 'drums',
            color: 'orange',
            show: false
        }
    ]
};
module.exports = config;