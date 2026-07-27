import Phaser from 'phaser'
import { Beach } from './scenes/beach_scene'
import { Children_room } from './scenes/children_room_scene'
import { Classroom } from './scenes/classroom_scene'
import { Garage } from './scenes/garage_scene'
import { Sea } from './scenes/sea_scene'
import {
    GAME_WIDTH,
    GAME_HEIGHT
} from './utils/constants'
//import { MenuScene } from './scenes/menu_scene'


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: GAME_WIDTH,
    height: GAME_HEIGHT,

    backgroundColor: '#0c0707',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {
        default: 'arcade',

        arcade: {
            debug: false
        }
    },

    scene: [
        //MenuScene,
        Classroom,
        Beach,
        Children_room,
        Garage,
        Sea
    ]
}

new Phaser.Game(config)