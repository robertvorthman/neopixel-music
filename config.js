var config = {
    port: 3000,
    numPixels: 144,
    cron: '*/30 * * * * *',
    delayBetweenSongs: 100,
    audioPath: 'audio/',
    songs: [
        {
            audioFile: "HarkTheHeraldAngelsSing-sample.aiff",
            midiFile: "HarkTheHeraldAngelsSing-sample.mid"
        },
        {
            audioFile: "CarolOfTheBells-sample.aiff",
            midiFile: "CarolOfTheBells-sample.mid"
        }
    ]
};
module.exports = config;