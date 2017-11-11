var config = {
    port: 3000,
    numPixels: 144,
    cron: '*/30 * * * * *',
    delayBetweenSongs: 100,
    colors: ['red', 'green', 'purple'],
    audioPath: 'audio/',
    songs: [
        {
            audioFile: "wizards in winter.mp3",
            midiFile: "wizards edit 5.mid",
            midiTempo: 148.3,
            tracksUseFullWidth: true
        },
        {
            audioFile: "sarajevo.aiff",
            midiFile: "sarajevo.mid"
        }
        ,
        {
            audioFile: "HarkTheHeraldAngelsSing.aiff",
            midiFile: "HarkTheHeraldAngelsSing.mid"
        },
        {
            audioFile: "CarolOfTheBells.aiff",
            midiFile: "CarolOfTheBells.mid"
        }
    ]
};
module.exports = config;