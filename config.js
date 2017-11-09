var config = {
    port: 3000,
    numPixels: 144,
    cron: '*/15 9-16 * * *',
    audioPath: 'audio/',
    songs: [
        {
            audioFile: "HarkTheHeraldAngelsSing-sample.aiff",
            midiFile: "HarkTheHeraldAngelsSing-sample.mid",
            midiTempo: 210
        },
        {
            audioFile: "CarolOfTheBells-sample.aiff",
            midiFile: "CarolOfTheBells-sample.mid",
            midiTempo: 200
        }
    ]
};
module.exports = config;