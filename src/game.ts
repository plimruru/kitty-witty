import Phaser from "phaser";

import { BootScene } from "./scenes/boot_scene";
import { MenuScene } from "./scenes/menu_scene";

export class Game extends Phaser.Game {

    constructor() {

        super({
            type: Phaser.AUTO,
            width: 1280,
            height: 720,
            backgroundColor: "#20242d",
            scene: [
                BootScene,
                MenuScene
            ]
        });

    }

}