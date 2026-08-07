import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from '../ui/theme'
import { UI_TEXTURES } from '../ui/ui_assets'
import { UIButton } from '../ui/button'
import { MiniGameOptions } from './mini_game_factory'
import { MiniGameBase } from './mini_game_base'

interface Fish {
    container: Phaser.GameObjects.Container
    body: Phaser.GameObjects.Arc
    tail: Phaser.GameObjects.Triangle
    size: number
    speed: number
    vx: number
    vy: number
    isBig: boolean
    color: number
}

interface Food {
    circle: Phaser.GameObjects.Arc
    x: number
    y: number
}

/**
 * Feed and Grow — покорми рыбок, чтобы они выросли.
 * Кликай по корму, рыбки съедают его и растут.
 * Нужно вырастить 5 больших рыб за 60 секунд.
 */
export class FeedAndGrow extends MiniGameBase {
    private readonly fishList: Fish[] = []
    private readonly foodList: Food[] = []
    private timeLeft = 120
    private bigFishCount = 0
    private readonly totalBigFishNeeded = 5
    private foodTimer = 0
    private foodInterval = 500
    private timerText!: Phaser.GameObjects.Text
    private progressText!: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, options: MiniGameOptions) {
        super(scene, options)

        this.createBackground()
        this.createTitle('Покорми рыбок', 'Кликай по корму, чтобы рыбки его съели и выросли! Вырасти 5 больших рыб!')
        this.createCloseButton()
        this.createTimer()
        this.createProgress()
        this.createFish()

        this.scene.events.on('update', this.update, this)

        // Clean up on destroy
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off('update', this.update, this)
        })
    }

    private createTimer(): void {
        this.timerText = this.scene.add.text(
            960, 160,
            `Время: ${this.timeLeft}`,
            uiTextStyle(26, UI_COLORS.sun, true)
        ).setOrigin(0.5)
        this.timerText.setScrollFactor(0)
        this.add(this.timerText)
    }

    private createProgress(): void {
        this.progressText = this.scene.add.text(
            960, 200,
            `Больших рыб: ${this.bigFishCount}/${this.totalBigFishNeeded}`,
            uiTextStyle(22, UI_COLORS.paper, true)
        ).setOrigin(0.5)
        this.progressText.setScrollFactor(0)
        this.add(this.progressText)
    }

    private createFish(): void {
        const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdd85b6, 0x6c5ce7, 0x00b894]
        for (let i = 0; i < 8; i++) {
            const x = Phaser.Math.Between(200, 1720)
            const y = Phaser.Math.Between(250, 900)
            const size = 15
            const color = colors[i % colors.length]
            const container = this.scene.add.container(x, y)
            const body = this.scene.add.circle(0, 0, size, color)
            const tail = this.scene.add.triangle(
                -size, 0,
                0, -size * 0.6,
                0, size * 0.6,
                -size * 1.2, 0,
                color
            )
            container.add([body, tail])
            container.setScrollFactor(0)
            this.add(container)

            const speed = Phaser.Math.Between(50, 120)
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
            this.fishList.push({
                container,
                body,
                tail,
                size,
                speed,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                isBig: false,
                color
            })
        }
    }

    private spawnFood(): void {
        if (this.isGameOver) return
        const x = Phaser.Math.Between(200, 1720)
        const y = Phaser.Math.Between(250, 900)
        const circle = this.scene.add.circle(x, y, 8, 0xffd700)
        circle.setScrollFactor(0)
        this.add(circle)

        circle.setInteractive({ useHandCursor: true })
        circle.on('pointerdown', () => this.onFoodClick(circle))

        this.foodList.push({ circle, x, y })
    }

    private onFoodClick(foodCircle: Phaser.GameObjects.Arc): void {
        if (this.isGameOver) return

        const foodIndex = this.foodList.findIndex(f => f.circle === foodCircle)
        if (foodIndex === -1) return
        const food = this.foodList[foodIndex]

        // Find nearest non-big fish
        let nearestFish: Fish | null = null
        let minDist = Infinity
        for (const fish of this.fishList) {
            if (fish.isBig) continue
            const dist = Phaser.Math.Distance.Between(
                fish.container.x, fish.container.y,
                food.x, food.y
            )
            if (dist < minDist) {
                minDist = dist
                nearestFish = fish
            }
        }

        if (nearestFish) {
            // Grow the fish
            nearestFish.size += 5
            nearestFish.body.setRadius(nearestFish.size)
            nearestFish.tail.setTo(
                -nearestFish.size, 0,
                0, -nearestFish.size * 0.6,
                0, nearestFish.size * 0.6,
                -nearestFish.size * 1.2, 0
            )

            // Check if big
            if (nearestFish.size >= 40) {
                nearestFish.isBig = true
                this.bigFishCount++
                this.progressText.setText(
                    `Больших рыб: ${this.bigFishCount}/${this.totalBigFishNeeded}`
                )

                // Remove fish from scene with animation
                this.scene.tweens.add({
                    targets: nearestFish.container,
                    alpha: 0,
                    scale: 1.5,
                    duration: 400,
                    onComplete: () => {
                        nearestFish.container.destroy()
                        this.fishList.splice(this.fishList.indexOf(nearestFish), 1)
                    }
                })

                if (this.bigFishCount >= this.totalBigFishNeeded) {
                    this.win()
                }
            }
        }

        // Remove food
        foodCircle.destroy()
        this.foodList.splice(foodIndex, 1)
    }

    private update(): void {
        if (this.isGameOver) return

        // Update timer (assuming 60fps)
        this.timeLeft -= 1 / 60
        if (this.timeLeft <= 0) {
            this.timeLeft = 0
            this.lose()
        }
        this.timerText.setText(`Время: ${Math.ceil(this.timeLeft)}`)

        // Move fish
        for (const fish of this.fishList) {
            if (fish.isBig) continue
            fish.container.x += fish.vx * (1 / 60)
            fish.container.y += fish.vy * (1 / 60)

            // Bounce off bounds
            if (fish.container.x < 100 || fish.container.x > 1820) {
                fish.vx *= -1
                fish.container.x = Phaser.Math.Clamp(fish.container.x, 100, 1820)
            }
            if (fish.container.y < 200 || fish.container.y > 950) {
                fish.vy *= -1
                fish.container.y = Phaser.Math.Clamp(fish.container.y, 200, 950)
            }

            // Rotate fish to face direction
            const angle = Math.atan2(fish.vy, fish.vx)
            fish.container.setRotation(angle)
        }

        // Spawn food periodically
        this.foodTimer += 16 // ms
        if (this.foodTimer >= this.foodInterval) {
            this.foodTimer = 0
            this.foodInterval = Phaser.Math.Between(1000, 2000)
            this.spawnFood()
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
        new FeedAndGrow(this.scene, this.options)
    }
}
