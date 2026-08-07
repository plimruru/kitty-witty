import Phaser from "phaser";

export class BootScene extends Phaser.Scene {

    constructor() {
        super("BootScene");
    }

    preload() {
        console.log("Загрузка ресурсов...");
    }

    create() {
        console.log("BootScene запущена");

        this.scene.start("MenuScene");
    }

}