var config = {
    port: 3000,
    numPixels: 144,
    cronSchedule: '*/15 * * * * *',
    cronName: 'test',
    audioPath: 'audio/',
    songs: [
        {
            midiFile: "wizards edit 5.mid",
            midiTempo: 148.3,
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
            midiFile: "wizards in winter.mid",
            midiTempo: 148.3,
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
        }
    ]
};
module.exports = config;