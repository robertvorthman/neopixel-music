var config = {
    port: 3000,
    numPixels: 144,
    cron: '* * * */15 * *',
    delayBetweenSongs: 1000,
    colors: ['red', 'green', 'purple'], //colors roll over if number of tracks exceeds number of colors
    audioPath: 'audio/',
    pitchSort: 'ascending', //defaults to ascending, tracks with higher pitch median note appear at end of pixel strip
    songs: [
    /*
        {
            audioFile: "Jingle Bells.aiff",
            midiFile: "Jingle Bells.mid",
        },{
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
        */
        {
            audioFile: "dancy of the sugar plum fairy.aiff",
            midiFile: "dancy of the sugar plum fairy.mid",
            tracksUseFullWidth: true,
            trackOptions: [
                {
                    name: "Track3",
                    color: 'pink',
                },
                {
                    name: "Track2",
                    color: "purple"
                }
            ]
        },
        
        /*
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
        */
    ]
};
module.exports = config;