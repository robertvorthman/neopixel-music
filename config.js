var config = {
    numPixels: 100,
    cron: '0 */10 * * * *',
    audioPath: 'audio/',
    colors: ['green', 'red', 'purple'],
    offColor: '#100000',
    colorOrder: 'RBG',
    pitchSort: 'descending',
    songs: [
        {
            audioFile: "Sleigh Ride.mp3",
            midiFile: "sleigh.mid",
            volume: .8,
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
            audioFile: "Nutcracker - March of the Toy Soldiers.mp3",
            midiFile: "nutcracker - march of the toy soldiers edit 6.mid",
            tracksUseFullWidth: true,
            volume: .8,
            trackOptions: [
                {
                    name: "Track1",
                    color: 'pink'
                },
                {
                    name: "Track2",
                    color: 'green'
                },
                {
                    name: "Track3",
                    color: 'red'
                },
                {
                    name: "Track4",
                    color: 'pink'
                }
            ]
        },{
            audioFile: "Carol of the Bells.mp3",
            midiFile: "Carol of the Bells.mid",
            volume: .7,
            trackOptions: [
                {
                    name: "Track1",
                    hide: true
                },
                {
                    name: "Track2",
                    hide: true
                },
                {
                    name: "Track4",
                    hide: true
                },
                {
                    name: "Track5",
                    hide: true
                },
                {
                    name: "Track7",
                    hide: true
                },
                {
                    name: "Track11",
                    hide: true
                },
                {
                    name: "Track12",
                    hide: true
                },
                {
                    name: "Track13",
                    hide: true
                }
            ]
        },
        {
            audioFile: "Nutcracker - Russian Dance.mp3",
            midiFile: "Nutcracker - Russian Dance.mid",
            volume: .7
        },
        {
            audioFile: "Ding Dong Merrily on High.mp3",
            midiFile: "Ding Dong Merrily on High.mid",
            volume: .8,
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
            audioFile: "Nutcracker - Dance of the Sugar Plum Fairies.mp3",
            midiFile: "Nutcracker - Dance of the Sugar Plum Fairies.mid",
            volume: 1,
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
            audioFile: "Wizards In Winter.mp3",
            midiFile: "wizards edit 5.mid",
            midiTempo: 148.3,
            tracksUseFullWidth: true,
            delay: 300,
            volume: .6,
            trackOptions: [
                {
                    name: "Track9",
                    hide: true
                }
            ]
        }
    ]
};
module.exports = config;