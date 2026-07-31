import { BaseScene } from './base_scene'

export class Sea extends BaseScene {
    constructor() {
        super(
            'sea',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'sea',
                    path: 'sea.png'
                },
                playerScale: 1,
                locationScale: 1.30,
                scrollable: true,
                obstacles: [
                    {
                        x: 740,
                        y: 110,
                        width: 1605,
                        height: 205
                    },

                    {
                        x: 1694,
                        y: 300,
                        width: 322,
                        height: 233
                    },

                    {
                        x: 29,
                        y: 26,
                        width: 710,
                        height: 228
                    },

                    {
                        x: 1539,
                        y: 279,
                        width: 53,
                        height: 62
                    },

                    {
                        x: 20,
                        y: 25,
                        width: 74,
                        height: 772
                    },

                    {
                        x: 95,
                        y: 387,
                        width: 87,
                        height: 183
                    },

                    {
                        x: 23,
                        y: 769,
                        width: 2330,
                        height: 56
                    },

                    {
                        x: 32,
                        y: 703,
                        width: 1016,
                        height: 704
                    },

                    {
                        x: 272,
                        y: 670,
                        width: 431,
                        height: 35
                    },

                    {
                        x: 450,
                        y: 515,
                        width: 260,
                        height: 163
                    },

                    {
                        x: 1205,
                        y: 445,
                        width: 264,
                        height: 352
                    },

                    {
                        x: 1022,
                        y: 445,
                        width: 174,
                        height: 187
                    },

                    {
                        x: 1473,
                        y: 673,
                        width: 154,
                        height: 132
                    },

                    {
                        x: 1927,
                        y: 639,
                        width: 406,
                        height: 165
                    },

                    {
                        x: 1961,
                        y: 611,
                        width: 368,
                        height: 20
                    },

                    {
                        x: 2188,
                        y: 515,
                        width: 154,
                        height: 98
                    },

                    {
                        x: 2188,
                        y: 515,
                        width: 154,
                        height: 98
                    }
                ]
            }
        )
    }
}
