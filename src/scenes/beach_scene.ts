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
                locationScale: 1
            }
        )
    }
}
