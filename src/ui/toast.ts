import Phaser from 'phaser'
import { uiTextStyle } from './theme'
import { UI_TEXTURES } from './ui_assets'

export class Toast extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        title: string,
        message: string,
        duration = 2800
    ) {
        super(scene, 0, 0)
        scene.add.existing(this)
        this.setDepth(1100)

        const panel = scene.add.image(
            1515,
            180,
            UI_TEXTURES.locationLabel
        ).setDisplaySize(590, 116)
        const heading = scene.add.text(
            1274,
            143,
            title,
            uiTextStyle(21, '#bd6047', true)
        )
        const body = scene.add.text(
            1274,
            179,
            message,
            {
                ...uiTextStyle(19),
                wordWrap: { width: 500 }
            }
        )
        this.add([panel, heading, body])

        scene.tweens.add({
            targets: this,
            alpha: 0,
            y: -15,
            delay: duration,
            duration: 450,
            onComplete: () => this.destroy()
        })
    }
}
