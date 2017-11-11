var config = {
    port: 3000,
    numPixels: 144,
    cron: '*/30 * * * * *',
    delayBetweenSongs: 100,
    colors: ['red', 'green', 'purple'],
    audioPath: 'audio/',
    songs: [
        {
            audioFile: "dingdong.aiff",
            midiFile: "dingdong.mid",
        },
        {
            audioFile: "deck the halls.aiff",
            midiFile: "deck the halls.mid",
        },
        {
            audioFile: "sleigh.aiff",
            midiFile: "sleigh.mid",
        },
        {
            audioFile: "dancy of the sugar plum fairy.aiff",
            midiFile: "dancy of the sugar plum fairy.mid",
            tracksUseFullWidth: true
        },
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