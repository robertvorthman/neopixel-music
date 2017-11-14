var config = {
    port: 3000,
    numPixels: 100,
    cron: '0 */10 * * * *',
    delayBetweenSongs: 5000,
    offColor: '#100000',
    colors: ['red', 'green', 'purple'], //optional, colors roll over if number of tracks exceeds number of colors
    audioPath: 'audio/',
    pitchSort: 'ascending', //defaults to ascending, tracks with higher pitch median note appear at end of pixel strip
    songs: [
        {
            audioFile: "nutcracker - march of the toy soldiers.mp3",
            midiFile: "nutcracker - march of the toy soldiers edit 4.mid",
            tracksUseFullWidth: true
        },
        {
            audioFile: "nut3trep2.mp3",
            midiFile: "nut3trep2.mid",
        },
        {
            audioFile: "nut5chin2.mp3",
            midiFile: "nut5chin2.mid",
        },
        {
            audioFile: "nut6reed2.mp3",
            midiFile: "nut6reed2.mid",
        },
        {
            audioFile: "Sleigh Ride.mp3",
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
            audioFile: "Dance of the Sugar Plum Fairies.mp3",
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
            audioFile: "Jingle Bells.mp3",
            midiFile: "Jingle Bells.mid",
        },
        {
            audioFile: "Ding Dong Merrily on High.mp3",
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