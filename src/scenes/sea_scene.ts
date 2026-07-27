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
                locationScale: 1
            }
        )
    }
}
