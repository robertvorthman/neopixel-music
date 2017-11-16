var config = {
    numPixels: 70,
    startPixel: 30,
    cron: '0 */10 * * * *',
    audioPath: 'audio/',
    offColor: '#100000',
    colorOrder: 'RBG',
    //pitchSort: 'descending',
    songs: [
        {
            audioFile: "Nutcracker - March of the Toy Soldiers.mp3",
            midiFile: "nutcracker - march of the toy soldiers edit 6.mid",
            tracksUseFullWidth: true
        },
        {
            audioFile: "Nutcracker - Russian Dance.mp3",
            midiFile: "Nutcracker - Russian Dance.mid",
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
            audioFile: "Nutcracker - Dance of the Sugar Plum Fairies.mp3",
            midiFile: "Nutcracker - Dance of the Sugar Plum Fairies.mid",
            offColor: 'black',
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
            audioFile: "Ding Dong Merrily on High.mp3",
            midiFile: "Ding Dong Merrily on High.mid",
            trackOptions: [
                {
                    name: "Track1",
                    hide: true
                },
                {
                    name: "Track4",
                    hide: true
                },
                {
                    name: "Track5",
                    hide: true
                }
            ]
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