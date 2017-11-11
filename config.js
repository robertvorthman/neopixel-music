var config = {
    port: 3000,
    numPixels: 144,
    cron: '* */30 * * * *',
    delayBetweenSongs: 1000,
    colors: ['red', 'green', 'purple'], //optional, colors roll over if number of tracks exceeds number of colors
    audioPath: 'audio/',
    pitchSort: 'ascending', //defaults to ascending, tracks with higher pitch median note appear at end of pixel strip
    songs: [
        {
            audioFile: "Sleigh Ride.aiff",
            midiFile: "sleigh.mid",
            trackOptions: [
                {
                    name: "Track4",
                    hide: true
                },{
                    name: "Track5",
                    hide: true
                }
            ]
        },
        {
            audioFile: "Dance of the Sugar Plum Fairies.aiff",
            midiFile: "dancy of the sugar plum fairy.mid",
            trackOptions: [
                {
                    name: "Track3",
                    color: 'blue',
                },
                {
                    name: "Track2",
                    color: "purple"
                }
            ]
        },
        {
            audioFile: "Jingle Bells.aiff",
            midiFile: "Jingle Bells.mid",
        },
        {
            audioFile: "Ding Dong Merrily on High.aiff",
            midiFile: "dingdong.mid",
        },
        {
            audioFile: "Wizards In Winter.mp3",
            midiFile: "wizards edit 5.mid",
            midiTempo: 148.3,
            tracksUseFullWidth: true
        }
    ]
};
module.exports = config;