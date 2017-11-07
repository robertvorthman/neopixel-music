var config = {
    port: 3000,
    numPixels: 144,
    cron: '*/15 9-16 * * *',
    audioPath: 'audio/',
    songs: [
        {
            midiFile: "wizards edit 5.mid",
            midiTempo: 148.3,
            midiStartAt: 0,
            mp3File: "wizards in winter.mp3",
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
        },
        {
            midiFile: "CarolOfTheBells.mid",
            midiTempo: 188,
            midiStartAt: 1.8,
            mp3File: "10-Mannheim Steamroller-Carol of the Bells.mp3", //only syncs up to 2:00
            trackOptions: [
                {
                    name: 'meta',
                    color: 'gray',
                    show: false
                },
                {
                    name: 'drums',
                    color: 'orange',
                    show: false
                },
                {
                    name: 'drums',
                    color: 'orange',
                    show: false
                },
                {
                    name: 'drums',
                    color: 'orange',
                    show: false
                },
                {
                    name: 'drums',
                    color: 'orange',
                    show: false
                },
                {
                    name: 'drums',
                    color: 'orange',
                    show: false
                },
                {
                    name: 'drums',
                    color: 'orange',
                    show: false
                },
                {
                    name: 'bells1',
                    color: 'green',
                    show: true
                },
                {
                    name: 'bells2',
                    color: 'teal',
                    show: false
                },
                {
                    name: 'bass',
                    color: 'orange',
                    show: false
                },
                {
                    name: 'frenchhorn',
                    color: 'purple',
                    show: false
                },
                {
                    name: 'tuba',
                    color: 'brown',
                    show: false
                },
                {
                    name: 'fullbrass',
                    color: 'yellow',
                    show: false
                },
                {
                    name: 'synthbrass1',
                    color: 'red',
                    show: true
                },
                {
                    name: 'synthbrass2',
                    color: 'purple',
                    show: true
                }
            ]
        }
    ]
};
module.exports = config;