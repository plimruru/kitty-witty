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
                playerScale: 0.35,
                locationScale: 1.5,
                obstacles: []
            }
        )
    }
}