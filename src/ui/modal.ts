import Phaser from 'phaser'
import {
    UI_COLORS,
    UI_SIZE,
    uiTextStyle
} from './theme'
import { UI_TEXTURES } from './ui_assets'

export interface UIModalOptions {
    backgroundTexture?: string
}

export class UIModal extends Phaser.GameObjects.Container {
    protected readonly content: Phaser.GameObjects.Container

    constructor(
        scene: Phaser.Scene,
        title: string,
        subtitle: string,
        options: UIModalOptions = {}
    ) {
        super(scene, 0, 0)
        scene.add.existing(this)
        this.setDepth(1000)

        const blocker = scene.add.rectangle(
            0,
            0,
            UI_SIZE.width,
            UI_SIZE.height,
            UI_COLORS.shadow,
            0.58
        ).setOrigin(0).setInteractive({ useHandCursor: true })
        blocker.on('pointerdown', () => this.close())

        const panelX = 384
        const panelY = 204
        const panelWidth = 1152
        const panelHeight = 672
        const panel = scene.add.image(
            960,
            540,
            options.backgroundTexture ?? UI_TEXTURES.modalBackground
        ).setDisplaySize(panelWidth, panelHeight)
        const panelHit = scene.add.rectangle(
            panelX,
            panelY,
            panelWidth,
            panelHeight,
            UI_COLORS.white,
            0.001
        ).setOrigin(0).setInteractive()
        const heading = scene.add.text(
            440,
            246,
            title,
            uiTextStyle(34, '#24343b', true)
        )
        const subheading = scene.add.text(
            440,
            294,
            subtitle,
            uiTextStyle(19, '#607278')
        )
        const closeImage = scene.add.image(
            1472,
            232,
            UI_TEXTURES.closeInactive
        ).setDisplaySize(64, 64)
        const closeHit = scene.add.rectangle(
            1440,
            200,
            64,
            64,
            UI_COLORS.white,
            0.001
        ).setOrigin(0).setInteractive({ useHandCursor: true })
        closeHit.on('pointerdown', () => {
            closeImage.setTexture(UI_TEXTURES.closePressed)
        })
        closeHit.on('pointerup', () => this.close())
        closeHit.on('pointerout', () => {
            closeImage.setTexture(UI_TEXTURES.closeInactive)
        })
        this.content = scene.add.container(0, 0)
        this.add([
            blocker,
            panel,
            panelHit,
            heading,
            subheading,
            closeImage,
            closeHit,
            this.content
        ])

        scene.input.keyboard?.on('keydown-ESC', this.close, this)
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            scene.input.keyboard?.off('keydown-ESC', this.close, this)
        })
    }

    close() {
        this.destroy()
    }
}
