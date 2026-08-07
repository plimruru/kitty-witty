import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from '../ui/theme'
import { UI_TEXTURES } from '../ui/ui_assets'
import { UIButton } from '../ui/button'
import { MiniGameOptions } from './mini_game_factory'

interface GearState {
    container: Phaser.GameObjects.Container
    angle: number
    speed: number
    fixed: boolean
    targetAngle: number
}

/**
 * Fix the Gadget — почини механизм.
 * Останови вращающиеся шестерёнки кликом в нужный момент.
 */
export class FixGadget extends Phaser.GameObjects.Container {
    private readonly options: MiniGameOptions
    private readonly gears: GearState[] = []
    private progressText!: Phaser.GameObjects.Text
    private resultText!: Phaser.GameObjects.Text
    private isRunning = true
    private isGameOver = false

    constructor(scene: Phaser.Scene, options: MiniGameOptions) {
        super(scene, 0, 0)
        this.options = options
        this.setDepth(1000)
        scene.add.existing(this)

        this.createBackground()
        this.createTitle()
        this.createCloseButton()
        this.createProgress()
        this.createGears()

        this.scene.events.on('update', this.update, this)

        // Clean up on destroy
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off('update', this.update, this)
        })
    }

    private createBackground(): void {
        const bg = this.scene.add.rectangle(
            0, 0, 1920, 1080,
            UI_COLORS.shadow, 0.85
        ).setOrigin(0).setInteractive({ useHandCursor: true })
        this.add(bg)
    }

    private createTitle(): void {
        const title = this.scene.add.text(
            960, 60,
            'Почини механизм',
            uiTextStyle(36, UI_COLORS.paper, true)
        ).setOrigin(0.5)
        this.add(title)

        const subtitle = this.scene.add.text(
            960, 110,
            'Кликни по шестерёнке, чтобы остановить её в нужном положении!',
            uiTextStyle(20, UI_COLORS.paper)
        ).setOrigin(0.5)
        this.add(subtitle)
    }

    private createCloseButton(): void {
        const closeBtn = this.scene.add.image(
            1850, 50,
            UI_TEXTURES.closeInactive
        ).setInteractive({ useHandCursor: true })
        closeBtn.on('pointerdown', () => this.close())
        closeBtn.on('pointerover', () => closeBtn.setTexture(UI_TEXTURES.closePressed))
        closeBtn.on('pointerout', () => closeBtn.setTexture(UI_TEXTURES.closeInactive))
        this.add(closeBtn)
    }

    private createProgress(): void {
        this.progressText = this.scene.add.text(
            960, 160,
            'Исправлено: 0/3',
            uiTextStyle(26, UI_COLORS.sun, true)
        ).setOrigin(0.5)
        this.add(this.progressText)
    }

    private createGears(): void {
        const positions = [
            { x: 600, y: 500, speed: 2.5, target: 90 },
            { x: 960, y: 500, speed: -2, target: 180 },
            { x: 1320, y: 500, speed: 1.5, target: 270 }
        ]

        positions.forEach((pos, index) => {
            const container = this.scene.add.container(pos.x, pos.y)

            // Gear body
            const gear = this.scene.add.circle(
                0, 0, 80,
                UI_COLORS.sea
            ).setStrokeStyle(4, UI_COLORS.seaDark)

            // Gear teeth
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2
                const tooth = this.scene.add.rectangle(
                    Math.cos(angle) * 92,
                    Math.sin(angle) * 92,
                    22, 22,
                    UI_COLORS.seaDark
                )
                container.add(tooth)
            }

            // Center hole
            const center = this.scene.add.circle(
                0, 0, 18,
                UI_COLORS.paper
            ).setStrokeStyle(2, UI_COLORS.inkSoft)

            container.add([gear, center])
            container.setSize(200, 200)
            container.setInteractive({ useHandCursor: true })
            container.on('pointerdown', () => this.onGearClick(index))
            this.add(container)

            this.gears.push({
                container,
                angle: index * 30,
                speed: pos.speed,
                fixed: false,
                targetAngle: pos.target
            })
        })
    }

    private update(): void {
        if (!this.isRunning || this.isGameOver) return
        this.gears.forEach((gear) => {
            if (!gear.fixed) {
                gear.angle = (gear.angle + gear.speed) % 360
                gear.container.rotation = Phaser.Math.DegToRad(gear.angle)
            }
        })
    }

    private onGearClick(index: number): void {
        const gear = this.gears[index]
        if (gear.fixed) return

        const normalizedAngle = ((gear.angle % 360) + 360) % 360
        const diff = Math.abs(normalizedAngle - gear.targetAngle)
        const tolerance = 20

        if (diff <= tolerance || diff >= 360 - tolerance) {
            gear.fixed = true
            gear.container.setAlpha(0.6)
            gear.container.setTint(UI_COLORS.success)

            // Flash effect
            this.scene.tweens.add({
                targets: gear.container,
                alpha: 1,
                duration: 300,
                yoyo: true
            })

            this.updateProgress()
            if (this.gears.every(g => g.fixed)) {
                this.win()
            }
        } else {
            // Missed — small shake feedback
            this.scene.tweens.add({
                targets: gear.container,
                x: gear.container.x + 8,
                duration: 60,
                yoyo: true,
                repeat: 2
            })
        }
    }

    private updateProgress(): void {
        const fixedCount = this.gears.filter(g => g.fixed).length
        this.progressText.setText(`Исправлено: ${fixedCount}/3`)
    }

    private win(): void {
        this.isRunning = false
        this.isGameOver = true
        this.showResult('Победа!', UI_COLORS.success)
        this.options.onComplete?.()
    }

    private showResult(message: string, color: number): void {
        this.resultText = this.scene.add.text(
            960, 700,
            message,
            uiTextStyle(48, color, true)
        ).setOrigin(0.5)
        this.add(this.resultText)

        const retryBtn = new UIButton(this.scene, 960, 800, {
            width: 220,
            height: 60,
            label: 'Попробовать снова',
            fill: UI_COLORS.coral,
            onClick: () => {
                this.destroy()
                new FixGadget(this.scene, this.options)
            }
        })
        this.add(retryBtn)
    }

    private close(): void {
        this.isRunning = false
        this.destroy()
    }
}
