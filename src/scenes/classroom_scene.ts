import { BaseScene } from './base_scene'


export class Classroom extends BaseScene {
    constructor() {
        super(
            'classroom',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'classroom',
                    path: 'classroom.png'
                },
                playerScale: 1,
                locationScale: 1.35,
                obstacles: [
                        {
                        x: 218,
                        y: 384,
                        width: 89,
                        height: 90
                    },

                    {
                        x: 365,
                        y: 384,
                        width: 100,
                        height: 90
                    },

                    {
                        x: 524,
                        y: 384,
                        width: 100,
                        height: 90
                    },

                    {
                        x: 524,
                        y: 512,
                        width: 104,
                        height: 90
                    },

                    {
                        x: 363,
                        y: 512,
                        width: 104,
                        height: 90
                    },

                    {
                        x: 204,
                        y: 501,
                        width: 104,
                        height: 104
                    },

                    {
                        x: 525,
                        y: 638,
                        width: 100,
                        height: 90
                    },

                    {
                        x: 216,
                        y: 638,
                        width: 89,
                        height: 90
                    },

                    {
                        x: 381,
                        y: 638,
                        width: 89,
                        height: 90
                    },
                    
                    {
                        x: 35,
                        y: 302,
                        width: 57,
                        height: 464
                    },

                    {
                        x: 33,
                        y: 33,
                        width: 769,
                        height: 280
                    },

                    {
                        x: 320,
                        y: 301,
                        width: 476,
                        height: 19
                    },

                    {
                        x: 680,
                        y: 622,
                        width: 96,
                        height: 141
                    },
                    
                    {
                        x: 783,
                        y: 309,
                        width: 17,
                        height: 290
                    },

                    {
                        x: 680,
                        y: 622,
                        width: 96,
                        height: 141
                    },

                    {
                        x: 16,
                        y: 800,
                        width: 797,
                        height: 10
                    }
                ]
            }
        )
    }
}