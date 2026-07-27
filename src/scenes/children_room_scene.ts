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
                locationScale: 1.5
            }
        )
    }
}
