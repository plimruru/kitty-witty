import Phaser from 'phaser'
import { uiTextStyle } from './theme'
import { UI_TEXTURES } from './ui_assets'

export interface ButtonOptions {
    width: number
    height: number
    label: string
    onClick: () => void
    fill?: number
    textColor?: string
    disabled?: boolean
    fontSize?: number
}

export class UIButton extends Phaser.GameObjects.Container {
    private readonly background: Phaser.GameObjects.Image
    private readonly hitAreaObject: Phaser.GameObjects.Rectangle
    private disabled: boolean
    private readonly options: ButtonOptions

    constructor(scene: Phaser.Scene, x: number, y: number, options: ButtonOptions) {
        super(scene, x, y)
        this.options = options
        this.disabled = options.disabled ?? false
        scene.add.existing(this)

        this.background = scene.add.image(
            0,
            0,
            UI_TEXTURES.menuItemInactive
        ).setOrigin(0).setDisplaySize(options.width, options.height)
        const label = scene.add.text(
            options.width / 2,
            options.height / 2,
            options.label,
            uiTextStyle(
                options.fontSize ?? 22,
                options.textColor ?? '#684d4b',
                true
            )
        ).setOrigin(0.5)
        this.hitAreaObject = scene.add.rectangle(
            0,
            0,
            options.width,
            options.height,
            0xffffff,
            0.001
        ).setOrigin(0)

        this.add([this.background, label, this.hitAreaObject])
        this.updateState(false)
        this.bindEvents()
    }

    setDisabled(value: boolean) {
        this.disabled = value
        this.updateState(false)
        this.hitAreaObject.input!.cursor = value ? 'default' : 'pointer'
        return this
    }

    private bindEvents() {
        this.hitAreaObject.setInteractive({ useHandCursor: !this.disabled })
        this.hitAreaObject.on('pointerover', () => {
            if (!this.disabled) {
                this.updateState(true)
                this.setScale(1.02)
            }
        })
        this.hitAreaObject.on('pointerout', () => {
            this.updateState(false)
            this.setScale(1)
        })
        this.hitAreaObject.on('pointerdown', () => {
            if (!this.disabled) {
                this.updateState(true)
                this.options.onClick()
            }
        })
    }

    private updateState(pressed: boolean) {
        this.background
            .setTexture(
                pressed
                    ? UI_TEXTURES.menuItemPressed
                    : UI_TEXTURES.menuItemInactive
            )
            .setAlpha(this.disabled ? 0.48 : 1)
    }
}
