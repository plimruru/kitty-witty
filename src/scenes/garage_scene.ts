import { BaseScene } from './base_scene'

export class Garage extends BaseScene {
    constructor() {
        super(
            'garage',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'garage',
                    path: 'garage.png'
                },
                playerScale: 1,
                locationScale: 1.35,
                obstacles: [
                    {
                        x: 21,
                        y: 21,
                        width: 525,
                        height: 329
                    },

                    {
                        x: 479,
                        y: 258,
                        width: 62,
                        height: 129
                    },

                    {
                        x: 544,
                        y: 20,
                        width: 268,
                        height: 265
                    },

                    {
                        x: 667,
                        y: 283,
                        width: 149,
                        height: 68
                    },

                    {
                        x: 704,
                        y: 339,
                        width: 109,
                        height: 76
                    },

                    {
                        x: 734,
                        y: 430,
                        width: 83,
                        height: 309
                    },

                    {
                        x: 23,
                        y: 797,
                        width: 796,
                        height: 30
                    },

                    {
                        x: 9,
                        y: 18,
                        width: 21,
                        height: 800
                    },

                    {
                        x: 247,
                        y: 472,
                        width: 280,
                        height: 204
                    },

                    {
                        x: 138,
                        y: 500,
                        width: 114,
                        height: 176
                    },
                ]
            }
        )
    }
}
