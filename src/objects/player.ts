import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string
    ) {
        super(
            scene,
            x,
            y,
            texture
        )

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setScale(0.35)

        this.setCollideWorldBounds(false)

        this.setBodySize(
            this.width * 0.5,
            this.height * 0.25
        )

        this.setOffset(
            this.width * 0.25,
            this.height * 0.75
        )
    }
}