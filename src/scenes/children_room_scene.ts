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
                playerScale: 0.35,
                locationScale: 1.5,

                obstacles: [
                    {
                        x: 500,
                        y: 400,
                        width: 200,
                        height: 100
                    },

                    {
                        x: 800,
                        y: 300,
                        width: 150,
                        height: 250
                    }
                ]

            }
        )
    }
}
