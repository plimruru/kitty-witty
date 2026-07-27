import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {

    constructor() {
        super("MenuScene");
    }

    create() {

        this.add.text(
            640,
            360,
            "KITTY WITTY",
            {
                fontSize: "48px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

    }

}