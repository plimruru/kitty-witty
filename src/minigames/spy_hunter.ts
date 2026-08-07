import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from '../ui/theme'
import { UI_TEXTURES } from '../ui/ui_assets'
import { UIButton } from '../ui/button'
import { MiniGameOptions } from './mini_game_factory'
import { MiniGameBase } from './mini_game_base'

interface Obstacle {
    rect: Phaser.GameObjects.Rectangle
    vx: number
    vy: number
}

interface Bonus {
    circle: Phaser.GameObjects.Arc
    vx: number
    vy: number
}

/**
 * Spy Hunter — проведи батискаф через препятствия.
 * Вид сверху, игрок управляет батискафом стрелками,
 * уклоняясь от скал и собирая бонусы.
 */
export class SpyHunter extends MiniGameBase {
    private submarine!: Phaser.GameObjects.Container
    private subBody!: Phaser.GameObjects.Ellipse
    private readonly obstacles: Obstacle[] = []
    private readonly bonuses: Bonus[] = []
    private score = 0
    private scoreText!: Phaser.GameObjects.Text
    private readonly targetScore = 500
    private readonly cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private obstacleTimer = 0
    private bonusTimer = 0

    constructor(scene: Phaser.Scene, options: MiniGameOptions) {
        super(scene, options)

        this.cursors = scene.input.keyboard!.createCursorKeys()

        this.createBackground()
        this.createTitle('Проведи батискаф', 'Управляй батискафом стрелками. Уклоняйся от скал и собирай бонусы!')
        this.createCloseButton()
        this.createScoreCounter()
        this.createSubmarine()
        this.startGame()

        // Clean up on destroy
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off('update', this.update, this)
        })
    }

    private createScoreCounter(): void {
        this.scoreText = this.scene.add.text(
            960, 160,
            `Очки: ${this.score}/${this.targetScore}`,
            uiTextStyle(26, UI_COLORS.sun, true)
        ).setOrigin(0.5)
        this.scoreText.setScrollFactor(0)
        this.add(this.scoreText)
    }

    private createSubmarine(): void {
        this.submarine = this.scene.add.container(960, 540)
        this.subBody = this.scene.add.ellipse(
            0, 0, 90, 40,
            UI_COLORS.sea
        ).setStrokeStyle(3, UI_COLORS.seaDark)
        const window = this.scene.add.circle(
            10, 0, 14,
            UI_COLORS.paper
        ).setStrokeStyle(2, UI_COLORS.inkSoft)
        const fin = this.scene.add.rectangle(
            -45, 0, 15, 25,
            UI_COLORS.seaDark
        )
        this.submarine.add([this.subBody, window, fin])
        this.submarine.setScrollFactor(0)
        this.add(this.submarine)
    }

    private startGame(): void {
        this.isRunning = true
        this.scene.events.on('update', this.update, this)
    }

    private spawnObstacle(): void {
        const x = Phaser.Math.Between(100, 1820)
        const y = 200
        const width = Phaser.Math.Between(40, 80)
        const height = Phaser.Math.Between(40, 80)
        const rect = this.scene.add.rectangle(
            x, y, width, height,
            UI_COLORS.coralDark
        ).setStrokeStyle(2, UI_COLORS.coral)
        rect.setScrollFactor(0)
        this.add(rect)
        this.obstacles.push({
            rect,
            vx: Phaser.Math.Between(-30, 30),
            vy: Phaser.Math.Between(100, 200)
        })
    }

    private spawnBonus(): void {
        const x = Phaser.Math.Between(100, 1820)
        const y = 200
        const circle = this.scene.add.circle(
            x, y, 12,
            0xffd700
        ).setStrokeStyle(2, 0xffaa00)
        circle.setScrollFactor(0)
        this.add(circle)
        this.bonuses.push({
            circle,
            vx: Phaser.Math.Between(-20, 20),
            vy: Phaser.Math.Between(80, 150)
        })
    }

    private update(): void {
        if (!this.isRunning || this.isGameOver) return

        // Move submarine with arrow keys
        const speed = 250
        let dx = 0
        let dy = 0
        if (this.cursors.left.isDown) dx = -1
        if (this.cursors.right.isDown) dx = 1
        if (this.cursors.up.isDown) dy = -1
        if (this.cursors.down.isDown) dy = 1

        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy)
            this.submarine.x += (dx / len) * speed * (1 / 60)
            this.submarine.y += (dy / len) * speed * (1 / 60)
        }

        // Clamp submarine to bounds
        this.submarine.x = Phaser.Math.Clamp(this.submarine.x, 50, 1870)
        this.submarine.y = Phaser.Math.Clamp(this.submarine.y, 180, 1000)

        // Spawn obstacles and bonuses
        this.obstacleTimer += 16
        if (this.obstacleTimer >= 1500) {
            this.obstacleTimer = 0
            this.spawnObstacle()
        }
        this.bonusTimer += 16
        if (this.bonusTimer >= 3000) {
            this.bonusTimer = 0
            this.spawnBonus()
        }

        // Move obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i]
            obs.rect.x += obs.vx * (1 / 60)
            obs.rect.y += obs.vy * (1 / 60)

            // Remove if off screen
            if (obs.rect.y > 1100) {
                obs.rect.destroy()
                this.obstacles.splice(i, 1)
                continue
            }

            // Check collision with submarine
            const dist = Phaser.Math.Distance.Between(
                obs.rect.x, obs.rect.y,
                this.submarine.x, this.submarine.y
            )
            if (dist < 50) {
                this.lose()
                return
            }
        }

        // Move bonuses
        for (let i = this.bonuses.length - 1; i >= 0; i--) {
            const bonus = this.bonuses[i]
            bonus.circle.x += bonus.vx * (1 / 60)
            bonus.circle.y += bonus.vy * (1 / 60)

            // Remove if off screen
            if (bonus.circle.y > 1100) {
                bonus.circle.destroy()
                this.bonuses.splice(i, 1)
                continue
            }

            // Check collection
            const dist = Phaser.Math.Distance.Between(
                bonus.circle.x, bonus.circle.y,
                this.submarine.x, this.submarine.y
            )
            if (dist < 40) {
                this.score += 50
                this.scoreText.setText(`Очки: ${this.score}/${this.targetScore}`)
                bonus.circle.destroy()
                this.bonuses.splice(i, 1)

                if (this.score >= this.targetScore) {
                    this.win()
                    return
                }
            }
        }
    }

    private win(): void {
        this.isRunning = false
        this.isGameOver = true
        this.showResult('Победа!', UI_COLORS.success)
    }

    private lose(): void {
        this.isRunning = false
        this.isGameOver = true
        this.showResult('Поражение', UI_COLORS.coral, 'Повторить')
    }

    protected restart(): void {
        new SpyHunter(this.scene, this.options)
    }
}
