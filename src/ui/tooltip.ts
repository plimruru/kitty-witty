import Phaser from 'phaser'
import { uiTextStyle } from './theme'
import { UI_TEXTURES } from './ui_assets'

export class Tooltip extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, text: string) {
        super(scene, 0, 0)
        scene.add.existing(this)
        this.setDepth(1200).setVisible(false)

        const label = scene.add.text(16, 12, text, {
            ...uiTextStyle(17),
            wordWrap: { width: 260 }
        })
        const bounds = label.getBounds()
        const panel = scene.add.image(
            0,
            0,
            UI_TEXTURES.locationLabel
        ).setOrigin(0).setDisplaySize(bounds.width + 32, bounds.height + 24)
        this.add([panel, label])
    }

    showAt(x: number, y: number, text?: string) {
        if (text) {
            const label = this.list.find(
                (item) => item instanceof Phaser.GameObjects.Text
            ) as Phaser.GameObjects.Text | undefined
            label?.setText(text)
        }
        return this.setPosition(x, y).setVisible(true)
    }

    hide() {
        return this.setVisible(false)
    }
}
