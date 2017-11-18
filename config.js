var config = {
    numPixels: 100,
    cron: '0 */10 * * * *',
    audioPath: 'audio/',
    offColor: '#100000',
    colorOrder: 'RBG',
    //pitchSort: 'descending',
    songs: [
        {
            audioFile: "Carol of the Bells MS.mp3",
            midiFile: "bells_gm.mid",
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
                    name: "Track3",
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
                    name: "Track6",
                    hide: true
                },
                {
                    name: "Track7",
                    hide: true
                },
                {
                    name: "Track9",
                    hide: true
                },
                {
                    name: "Track10",
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
                },
                {
                    name: "Track14",
                    hide: true
                },
                {
                    name: "Track16",
                    hide: true
                },
                {
                    name: "Track17",
                    hide: true
                },
                {
                    name: "Track18",
                    hide: true
                },
                {
                    name: "Track19",
                    hide: true
                },
                {
                    name: "Track20",
                    hide: true
                },
                {
                    name: "Track21",
                    hide: true
                },
                {
                    name: "Track22",
                    hide: true
                },
                {
                    name: "Track23",
                    hide: true
                },
                {
                    name: "Track24",
                    hide: true
                },
                {
                    name: "Track25",
                    hide: true
                },
                {
                    name: "Track26",
                    hide: true
                }
            ]
        },
        {
            audioFile: "Carol of the Bells.mp3",
            midiFile: "Carol of the Bells.mid",
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
            audioFile: "Nutcracker - March of the Toy Soldiers.mp3",
            midiFile: "nutcracker - march of the toy soldiers edit 6.mid",
            tracksUseFullWidth: true,
            volume: .9
        },
        {
            audioFile: "Nutcracker - Russian Dance.mp3",
            midiFile: "Nutcracker - Russian Dance.mid",
            volume: .8
        },
        {
            audioFile: "Sleigh Ride.mp3",
            midiFile: "sleigh.mid",
            volume: .9,
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
            audioFile: "Ding Dong Merrily on High.mp3",
            midiFile: "Ding Dong Merrily on High.mid",
            volume: .9,
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
            tracksUseFullWidth: true,
            delay: 300,
            volume: .6
        }
    ]
};
module.exports = config;