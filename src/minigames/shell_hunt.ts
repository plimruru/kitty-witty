import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from '../ui/theme'
import { UI_TEXTURES } from '../ui/ui_assets'
import { UIButton } from '../ui/button'
import { MiniGameOptions } from './mini_game_factory'

/**
 * Shell Hunt — арканоид с ракушками.
 * Платформа управляется мышью, мяч разбивает блоки-ракушки.
 */
export class ShellHunt extends Phaser.GameObjects.Container {
    private readonly options: MiniGameOptions
    private paddle!: Phaser.GameObjects.Rectangle
    private ball!: Phaser.GameObjects.Arc
    private ballVelocity!: Phaser.Math.Vector2
    private readonly blocks: Phaser.GameObjects.Rectangle[] = []
    private lives = 3
    private livesText!: Phaser.GameObjects.Text
    private resultText!: Phaser.GameObjects.Text
    private isRunning = false
    private isGameOver = false
    private readonly onPointerMove: (pointer: Phaser.Input.Pointer) => void

    constructor(scene: Phaser.Scene, options: MiniGameOptions) {
        super(scene, 0, 0)
        this.options = options
        this.setDepth(1000)
        scene.add.existing(this)

        this.onPointerMove = (pointer: Phaser.Input.Pointer) => {
            if (this.isRunning && !this.isGameOver) {
                this.paddle.x = Phaser.Math.Clamp(pointer.x, 110, 1810)
            }
        }

        this.createBackground()
        this.createTitle()
        this.createCloseButton()
        this.createLivesCounter()
        this.createPaddle()
        this.createBall()
        this.createBlocks()
        this.startGame()

        // Clean up listeners on destroy
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.input.off('pointermove', this.onPointerMove)
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
            'Собери ракушки',
            uiTextStyle(36, UI_COLORS.paper, true)
        ).setOrigin(0.5)
        this.add(title)

        const subtitle = this.scene.add.text(
            960, 110,
            'Разбей все ракушки мячом. Не дай мячу упасть!',
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

    private createLivesCounter(): void {
        this.livesText = this.scene.add.text(
            960, 160,
            `Жизни: ${this.lives}`,
            uiTextStyle(26, UI_COLORS.sun, true)
        ).setOrigin(0.5)
        this.add(this.livesText)
    }

    private createPaddle(): void {
        this.paddle = this.scene.add.rectangle(
            960, 1000, 220, 24,
            UI_COLORS.coral
        ).setStrokeStyle(3, UI_COLORS.coralDark)
        this.add(this.paddle)

        this.scene.input.on('pointermove', this.onPointerMove)
    }

    private createBall(): void {
        this.ball = this.scene.add.circle(
            960, 900, 14,
            UI_COLORS.sun
        )
        this.add(this.ball)
        this.ballVelocity = new Phaser.Math.Vector2(220, -320)
    }

    private createBlocks(): void {
        const blockWidth = 80
        const blockHeight = 32
        const gap = 12
        const cols = 10
        const rows = 4
        const startX = 960 - (blockWidth * cols + gap * (cols - 1)) / 2
        const startY = 220

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * (blockWidth + gap) + blockWidth / 2
                const y = startY + row * (blockHeight + gap) + blockHeight / 2
                const block = this.scene.add.rectangle(
                    x, y, blockWidth, blockHeight,
                    UI_COLORS.sea
                ).setStrokeStyle(2, UI_COLORS.seaDark)
                this.add(block)
                this.blocks.push(block)
            }
        }
    }

    private startGame(): void {
        this.isRunning = true
        this.scene.events.on('update', this.update, this)
    }

    private update(): void {
        if (!this.isRunning || this.isGameOver) return

        const dt = 1 / 60
        this.ball.x += this.ballVelocity.x * dt
        this.ball.y += this.ballVelocity.y * dt

        // Wall collisions
        if (this.ball.x <= 15 || this.ball.x >= 1905) {
            this.ballVelocity.x *= -1
            this.ball.x = Phaser.Math.Clamp(this.ball.x, 15, 1905)
        }
        if (this.ball.y <= 15) {
            this.ballVelocity.y *= -1
            this.ball.y = 15
        }

        // Paddle collision
        if (
            this.ball.y >= 985 && this.ball.y <= 1005 &&
            this.ball.x >= this.paddle.x - 110 &&
            this.ball.x <= this.paddle.x + 110
        ) {
            // Reflect angle based on hit position
            const hitPos = (this.ball.x - this.paddle.x) / 110
            this.ballVelocity.set(
                hitPos * 400,
                -Math.abs(this.ballVelocity.y)
            )
            this.ball.y = 985
        }

        // Block collisions
        const ballRect = new Phaser.Geom.Rectangle(
            this.ball.x - 14, this.ball.y - 14, 28, 28
        )
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i]
            const blockRect = new Phaser.Geom.Rectangle(
                block.x - 40, block.y - 16, 80, 32
            )
            if (Phaser.Geom.Intersects.RectangleToRectangle(ballRect, blockRect)) {
                // Determine collision side
                const overlapLeft = this.ball.x - (block.x - 40)
                const overlapRight = (block.x + 40) - this.ball.x
                const overlapTop = this.ball.y - (block.y - 16)
                const overlapBottom = (block.y + 16) - this.ball.y
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

                if (minOverlap === overlapTop || minOverlap === overlapBottom) {
                    this.ballVelocity.y *= -1
                } else {
                    this.ballVelocity.x *= -1
                }

                block.destroy()
                this.blocks.splice(i, 1)

                if (this.blocks.length === 0) {
                    this.win()
                }
                break
            }
        }

        // Ball falls below
        if (this.ball.y > 1080) {
            this.lives--
            this.livesText.setText(`Жизни: ${this.lives}`)
            if (this.lives <= 0) {
                this.lose()
            } else {
                this.ball.setPosition(960, 900)
                this.ballVelocity.set(220, -320)
            }
        }
    }

    private win(): void {
        this.isRunning = false
        this.isGameOver = true
        this.showResult('Победа!', UI_COLORS.success)
        this.options.onComplete?.()
    }

    private lose(): void {
        this.isRunning = false
        this.isGameOver = true
        this.showResult('Поражение', UI_COLORS.coral)
        this.options.onFail?.()
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
                new ShellHunt(this.scene, this.options)
            }
        })
        this.add(retryBtn)
    }

    private close(): void {
        this.isRunning = false
        this.destroy()
    }
}
