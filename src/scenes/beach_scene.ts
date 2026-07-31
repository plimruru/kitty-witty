import { BaseScene } from './base_scene'

export class Beach extends BaseScene {
    constructor() {
        super(
            'beach',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'beach',
                    path: 'beach.png'
                },
                playerScale: 1,
                locationScale: 0.7,
                obstacles: [

                    {
                        x: 41,
                        y: 557,
                        width: 1953,
                        height: 225
                    },

                    {
                        x: 1989,
                        y: 748,
                        width: 363,
                        height: 56
                    },

                    {
                        x: 2271,
                        y: 671,
                        width: 76,
                        height: 74
                    },

                    {
                        x: 30,
                        y: 475,
                        width: 81,
                        height: 120
                    },

                    {
                        x: 122,
                        y: 493,
                        width: 76,
                        height: 79
                    },

                    {
                        x: 174,
                        y: 527,
                        width: 877,
                        height: 95
                    },

                    {
                        x: 39,
                        y: 428,
                        width: 53,
                        height: 53
                    },

                    {
                        x: 408,
                        y: 497,
                        width: 188,
                        height: 40
                    },

                    {
                        x: 608,
                        y: 555,
                        width: 102,
                        height: 28
                    },

                    {
                        x: 687,
                        y: 493,
                        width: 279,
                        height: 66
                    },

                    {
                        x: 776,
                        y: 466,
                        width: 96,
                        height: 32
                    },

                    {
                        x: 1357,
                        y: 524,
                        width: 347,
                        height: 74
                    },

                    {
                        x: 1438,
                        y: 500,
                        width: 186,
                        height: 31
                    },

                    {
                        x: 1487,
                        y: 482,
                        width: 98,
                        height: 37
                    },

                    {
                        x: 1672,
                        y: 524,
                        width: 325,
                        height: 50
                    },

                    {
                        x: 1719,
                        y: 498,
                        width: 284,
                        height: 53
                    },

                    {
                        x: 1785,
                        y: 484,
                        width: 141,
                        height: 31
                    },

                    {
                        x: 1815,
                        y: 471,
                        width: 71,
                        height: 28
                    },

                    {
                        x: 166,
                        y: 235,
                        width: 193,
                        height: 231
                    },

                    {
                        x: 619,
                        y: 42,
                        width: 181,
                        height: 118
                    },

                    {
                        x: 1143,
                        y: 393,
                        width: 98,
                        height: 99
                    },

                    {
                        x: 1543,
                        y: 120,
                        width: 187,
                        height: 225
                    },

                    {
                        x: 1842,
                        y: 144,
                        width: 115,
                        height: 47
                    },

                    {
                        x: 1889,
                        y: 271,
                        width: 90,
                        height: 181
                    },

                    {
                        x: 2129,
                        y: 376,
                        width: 146,
                        height: 133
                    },

                    {
                        x: 149,
                        y: 76,
                        width: 136,
                        height: 55
                    }
                ]
            }
        )
    }
}
