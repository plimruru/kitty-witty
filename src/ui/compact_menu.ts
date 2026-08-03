import Phaser from 'phaser'
import { uiTextStyle } from './theme'
import { UI_TEXTURES } from './ui_assets'

export interface CompactMenuCallbacks {
    onInventory: () => void
    onMap: () => void
    onJournal: () => void
}

/**
 * Единственный постоянно видимый контрол.
 * Видимые части собраны из готовых PNG, hit-зоны прозрачные.
 */
export class CompactMenu extends Phaser.GameObjects.Container {
    private readonly panel: Phaser.GameObjects.Container
    private readonly toggleImage: Phaser.GameObjects.Image
    private opened = false

    constructor(scene: Phaser.Scene, callbacks: CompactMenuCallbacks) {
        super(scene, scene.scale.width - 20, 20)
        scene.add.existing(this)
        this.setDepth(900).setScrollFactor(0)

        this.toggleImage = scene.add.image(
            0,
            0,
            UI_TEXTURES.menuInactive
        ).setOrigin(1, 0).setDisplaySize(72, 72)
        const toggleHit = scene.add.rectangle(
            -72,
            0,
            72,
            72,
            0xffffff,
            0.001
        ).setOrigin(0).setInteractive({ useHandCursor: true })

        this.panel = scene.add.container(0, 80)
        const panelImage = scene.add.image(
            0,
            0,
            UI_TEXTURES.menuPanel
        ).setOrigin(1, 0).setDisplaySize(264, 336)
        const title = scene.add.text(
            -225,
            24,
            'МЕНЮ',
            uiTextStyle(18, '#684d4b', true)
        )
        this.panel.add([panelImage, title])

        const entries = [
            { label: 'РЮКЗАК', callback: callbacks.onInventory, y: 106 },
            { label: 'КАРТА', callback: callbacks.onMap, y: 178 },
            { label: 'ДНЕВНИК', callback: callbacks.onJournal, y: 250 }
        ]
        entries.forEach((entry) => {
            const image = scene.add.image(
                -24,
                entry.y,
                UI_TEXTURES.menuItemInactive
            ).setOrigin(1, 0).setDisplaySize(216, 72)
            const label = scene.add.text(
                -132,
                entry.y + 36,
                entry.label,
                uiTextStyle(18, '#684d4b', true)
            ).setOrigin(0.5)
            const hit = scene.add.rectangle(
                -240,
                entry.y,
                216,
                72,
                0xffffff,
                0.001
            ).setOrigin(0).setInteractive({ useHandCursor: true })

            hit.on('pointerover', () => {
                image.setTexture(UI_TEXTURES.menuItemPressed)
            })
            hit.on('pointerout', () => {
                image.setTexture(UI_TEXTURES.menuItemInactive)
            })
            hit.on('pointerdown', () => {
                image.setTexture(UI_TEXTURES.menuItemPressed)
                entry.callback()
            })
            this.panel.add([image, label, hit])
        })

        this.panel.setVisible(false).setAlpha(0).setScale(1, 0)
        toggleHit.on('pointerdown', () => {
            this.toggleImage.setTexture(
                this.opened
                    ? UI_TEXTURES.closePressed
                    : UI_TEXTURES.menuPressed
            )
            this.toggle()
        })
        toggleHit.on('pointerup', () => this.updateToggleTexture())
        toggleHit.on('pointerout', () => this.updateToggleTexture())
        this.add([this.toggleImage, toggleHit, this.panel])
    }

    open() {
        if (this.opened) return
        this.opened = true
        this.panel.setVisible(true)
        this.scene.tweens.add({
            targets: this.panel,
            alpha: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Power2'
        })
        this.updateToggleTexture()
    }

    close() {
        if (!this.opened) return
        this.opened = false
        this.scene.tweens.add({
            targets: this.panel,
            alpha: 0,
            scaleY: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => this.panel.setVisible(false)
        })
        this.updateToggleTexture()
    }

    toggle() {
        if (this.opened) this.close()
        else this.open()
    }

    private updateToggleTexture() {
        this.toggleImage.setTexture(
            this.opened
                ? UI_TEXTURES.closeInactive
                : UI_TEXTURES.menuInactive
        )
    }
}
