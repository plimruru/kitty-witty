import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from '../ui/theme'
import { UI_TEXTURES } from '../ui/ui_assets'
import { UIButton } from '../ui/button'
import { MiniGameOptions } from './mini_game_factory'

/**
 * Базовый класс для мини-игр.
 * Окно мини-игры всегда отображается по центру экрана,
 * независимо от прокрутки камеры.
 */
export abstract class MiniGameBase extends Phaser.GameObjects.Container {
    protected readonly options: MiniGameOptions
    protected resultText!: Phaser.GameObjects.Text
    protected rewardBtn: UIButton | null = null
    protected retryBtn: UIButton | null = null
    protected isRunning = false
    protected isGameOver = false
    protected rewardGiven = false

    constructor(scene: Phaser.Scene, options: MiniGameOptions) {
        super(scene, 0, 0)
        this.options = options
        this.setDepth(1000)

        // Позиционируем окно в центре экрана
        // Контейнер находится в (0,0), все элементы создаются с абсолютными координатами
        // и имеют setScrollFactor(0) чтобы не прокручивались
        this.setScrollFactor(0)

        scene.add.existing(this)
    }

    protected createBackground(): void {
        const bg = this.scene.add.rectangle(
            0, 0, 1920, 1080,
            UI_COLORS.shadow, 0.85
        ).setOrigin(0).setInteractive({ useHandCursor: true })
        bg.setScrollFactor(0)
        this.add(bg)
    }

    protected createCloseButton(): void {
        const closeBtn = this.scene.add.image(
            1850, 50,
            UI_TEXTURES.closeInactive
        ).setInteractive({ useHandCursor: true })
        closeBtn.setScrollFactor(0)
        closeBtn.on('pointerdown', () => this.close())
        closeBtn.on('pointerover', () => closeBtn.setTexture(UI_TEXTURES.closePressed))
        closeBtn.on('pointerout', () => closeBtn.setTexture(UI_TEXTURES.closeInactive))
        this.add(closeBtn)
    }

    protected createTitle(title: string, subtitle: string): void {
        const titleText = this.scene.add.text(
            960, 60,
            title,
            uiTextStyle(36, UI_COLORS.paper, true)
        ).setOrigin(0.5)
        titleText.setScrollFactor(0)
        this.add(titleText)

        const subtitleText = this.scene.add.text(
            960, 110,
            subtitle,
            uiTextStyle(20, UI_COLORS.paper)
        ).setOrigin(0.5)
        subtitleText.setScrollFactor(0)
        this.add(subtitleText)
    }

    /**
     * Показывает результат с кнопками "Получить награду" и "Повторить".
     * Награда выдаётся только при нажатии "Получить награду".
     */
    protected showResult(message: string, color: number, rewardLabel = 'Получить награду'): void {
        this.resultText = this.scene.add.text(
            960, 650,
            message,
            uiTextStyle(48, color, true)
        ).setOrigin(0.5)
        this.resultText.setScrollFactor(0)
        this.add(this.resultText)

        // Кнопка "Получить награду"
        this.rewardBtn = new UIButton(this.scene, 760, 780, {
            width: 260,
            height: 60,
            label: rewardLabel,
            fill: UI_COLORS.success,
            onClick: () => {
                if (this.rewardGiven) return
                this.rewardGiven = true
                this.options.onComplete?.()
                this.rewardBtn?.setDisabled(true)
            },
            fontSize: 18
        })
        this.rewardBtn.setScrollFactor(0)
        this.add(this.rewardBtn)

        // Кнопка "Повторить"
        this.retryBtn = new UIButton(this.scene, 1160, 780, {
            width: 220,
            height: 60,
            label: 'Повторить',
            fill: UI_COLORS.coral,
            onClick: () => {
                this.destroy()
                this.restart()
            }
        })
        this.retryBtn.setScrollFactor(0)
        this.add(this.retryBtn)
    }

    /** Перезапускает мини-игру */
    protected abstract restart(): void

    protected close(): void {
        this.isRunning = false
        this.destroy()
    }
}
