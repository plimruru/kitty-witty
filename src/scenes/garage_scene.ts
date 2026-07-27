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
                playerScale: 0.45,
                locationScale: 2
            }
        )
    }
}
