import { BaseScene } from './base_scene'

export class Children_room extends BaseScene {
    constructor() {
        super(
            'children_room',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'children_room',
                    path: 'children_room.png'
                },
                playerScale: 1,
                locationScale: 1.35,

                obstacles: [
                    {
                        x: 33,
                        y: 33,
                        width: 779,
                        height: 257
                    },

                    {
                        x: 63,
                        y: 191,
                        width: 254,
                        height: 129
                    },

                    {
                        x: 126,
                        y: 226,
                        width: 126,
                        height: 223
                    },

                    {
                        x: 20,
                        y: 480,
                        width: 76,
                        height: 257
                    },

                    {
                        x: 510,
                        y: 190,
                        width: 71,
                        height: 128
                    },

                    {
                        x: 147,
                        y: 746,
                        width: 89,
                        height: 44
                    },

                    {
                        x: 573,
                        y: 164,
                        width: 199,
                        height: 183
                    },

                    {
                        x: 678,
                        y: 385,
                        width: 121,
                        height: 417
                    },

                    {
                        x: 579,
                        y: 625,
                        width: 94,
                        height: 141
                    },

                    {
                        x: 610,
                        y: 415,
                        width: 70,
                        height: 129
                    },

                    {
                        x: 21,
                        y: 800,
                        width: 800,
                        height: 18
                    },

                    {
                        x: 16,
                        y: 268,
                        width: 16,
                        height: 541
                    }

                ]

            }
        )
    }
}
