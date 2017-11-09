var config = {
    port: 3000,
    numPixels: 144,
    cron: '*/15 9-16 * * *',
    audioPath: 'audio/',
    songs: [
        {
            audioFile: "HarkTheHeraldAngelsSing-sample.aiff",
            midiFile: "HarkTheHeraldAngelsSing-sample.mid"
        },
        {
            audioFile: "CarolOfTheBells-sample.aiff",
            midiFile: "CarolOfTheBells-sample.mid"
        },
        {
            audioFile: "Faeries.mp3",
            midiFile: "Faeries.mp3.mid"
        },
        {
            audioFile: "wizards in winter.mp3",
            midiFile: "wizards edit 5.mid",
            midiTempo: 148.3,
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