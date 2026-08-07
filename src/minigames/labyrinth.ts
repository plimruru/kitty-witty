import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from '../ui/theme'
import { UI_TEXTURES } from '../ui/ui_assets'
import { UIButton } from '../ui/button'
import { MiniGameOptions } from './mini_game_factory'
import { MiniGameBase } from './mini_game_base'

interface Guardian {
    container: Phaser.GameObjects.Container
    x: number
    y: number
    vx: number
    vy: number
    speed: number
    stunned: boolean
    stunTimer: number
}

interface Pearl {
    circle: Phaser.GameObjects.Arc
    x: number
    y: number
    collected: boolean
}

interface RuneKey {
    container: Phaser.GameObjects.Container
    x: number
    y: number
    collected: boolean
}

/**
 * Labyrinth — подводный стелс-лабиринт в стиле Pac-Man.
 * Игрок собирает 3 рунных ключа, уклоняясь от Древних Стражей.
 * Запас кислорода ограничен, можно пополнять жемчужинами.
 */
export class Labyrinth extends MiniGameBase {
    private player!: Phaser.GameObjects.Container
    private playerBody!: Phaser.GameObjects.Circle
    private readonly guardians: Guardian[] = []
    private readonly pearls: Pearl[] = []
    private readonly runeKeys: RuneKey[] = []
    private readonly walls: Phaser.GameObjects.Rectangle[] = []
    private readonly darkZones: Phaser.GameObjects.Rectangle[] = []
    private readonly currents: Phaser.GameObjects.Rectangle[] = []
    private readonly rubble: Phaser.GameObjects.Rectangle[] = []
    private oxygen = 100
    private maxOxygen = 100
    private oxygenText!: Phaser.GameObjects.Text
    private keysText!: Phaser.GameObjects.Text
    private keysCollected = 0
    private readonly totalKeys = 3
    private readonly cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private harpoonCooldown = 0
    private readonly harpoonCooldownMax = 10
    private harpoonText!: Phaser.GameObjects.Text
    private portal!: Phaser.GameObjects.Container
    private portalActive = false

    constructor(scene: Phaser.Scene, options: MiniGameOptions) {
        super(scene, options)

        this.cursors = scene.input.keyboard!.createCursorKeys()

        this.createBackground()
        this.createTitle('Подводный лабиринт', 'Собери 3 рунных ключа и доберись до портала! Уклоняйся от Стражей!')
        this.createCloseButton()
        this.createHUD()
        this.createMaze()
        this.createPlayer()
        this.createGuardians()
        this.createPearls()
        this.createRuneKeys()
        this.createPortal()
        this.startGame()

        // Clean up on destroy
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.scene.events.off('update', this.update, this)
        })
    }

    private createHUD(): void {
        this.oxygenText = this.scene.add.text(
            200, 60,
            `Кислород: ${this.oxygen}%`,
            uiTextStyle(26, UI_COLORS.sun, true)
        ).setOrigin(0, 0.5)
        this.oxygenText.setScrollFactor(0)
        this.add(this.oxygenText)

        this.keysText = this.scene.add.text(
            200, 110,
            `Ключи: ${this.keysCollected}/${this.totalKeys}`,
            uiTextStyle(22, UI_COLORS.paper, true)
        ).setOrigin(0, 0.5)
        this.keysText.setScrollFactor(0)
        this.add(this.keysText)

        this.harpoonText = this.scene.add.text(
            200, 160,
            'Гарпун: готов',
            uiTextStyle(18, UI_COLORS.paper)
        ).setOrigin(0, 0.5)
        this.harpoonText.setScrollFactor(0)
        this.add(this.harpoonText)
    }

    private createMaze(): void {
        // Создаём лабиринт из стен
        const wallColor = UI_COLORS.seaDark
        const wallConfigs: Array<[number, number, number, number]> = [
            // Внешние стены
            [100, 200, 1720, 20],
            [100, 200, 20, 700],
            [100, 880, 1720, 20],
            [1800, 200, 20, 700],
            // Внутренние стены
            [300, 300, 20, 200],
            [300, 500, 200, 20],
            [500, 300, 20, 200],
            [700, 300, 200, 20],
            [900, 300, 20, 200],
            [1100, 300, 200, 20],
            [1300, 300, 20, 200],
            [1500, 300, 200, 20],
            [300, 700, 200, 20],
            [500, 700, 20, 200],
            [700, 700, 200, 20],
            [900, 700, 20, 200],
            [1100, 700, 200, 20],
            [1300, 700, 20, 200],
            [1500, 700, 200, 20],
            // Центральная комната
            [800, 450, 320, 20],
            [800, 450, 20, 180],
            [1120, 450, 20, 180],
            [800, 630, 320, 20],
        ]

        for (const [x, y, w, h] of wallConfigs) {
            const wall = this.scene.add.rectangle(
                x, y, w, h,
                wallColor
            )
            wall.setScrollFactor(0)
            this.add(wall)
            this.walls.push(wall)
        }

        // Тёмные зоны (нужен аквариум/шлем)
        const darkZoneConfigs: Array<[number, number, number, number]> = [
            [350, 350, 100, 100],
            [1150, 550, 100, 100],
            [1550, 350, 100, 100],
        ]
        for (const [x, y, w, h] of darkZoneConfigs) {
            const zone = this.scene.add.rectangle(
                x, y, w, h,
                0x000000, 0.6
            )
            zone.setScrollFactor(0)
            this.add(zone)
            this.darkZones.push(zone)
        }

        // Течения (нужны ласты)
        const currentConfigs: Array<[number, number, number, number]> = [
            [550, 400, 100, 20],
            [950, 600, 100, 20],
            [1350, 400, 100, 20],
        ]
        for (const [x, y, w, h] of currentConfigs) {
            const zone = this.scene.add.rectangle(
                x, y, w, h,
                0x4d9290, 0.5
            )
            zone.setScrollFactor(0)
            this.add(zone)
            this.currents.push(zone)
        }

        // Завалы (разрушаются гарпуном)
        const rubbleConfigs: Array<[number, number, number, number]> = [
            [650, 350, 60, 60],
            [1050, 750, 60, 60],
            [1450, 550, 60, 60],
        ]
        for (const [x, y, w, h] of rubbleConfigs) {
            const zone = this.scene.add.rectangle(
                x, y, w, h,
                UI_COLORS.coralDark
            )
            zone.setScrollFactor(0)
            this.add(zone)
            this.rubble.push(zone)
        }
    }

    private createPlayer(): void {
        this.player = this.scene.add.container(200, 500)
        this.playerBody = this.scene.add.circle(
            0, 0, 15,
            UI_COLORS.sun
        ).setStrokeStyle(3, 0xffaa00)
        this.player.add(this.playerBody)
        this.player.setScrollFactor(0)
        this.add(this.player)
    }

    private createGuardians(): void {
        const colors = [0xff6b6b, 0x6c5ce7, 0x00b894]
        const positions = [
            { x: 960, y: 300, vx: 100, vy: 0 },
            { x: 300, y: 700, vx: 0, vy: -100 },
            { x: 1600, y: 700, vx: -100, vy: 0 }
        ]

        positions.forEach((pos, index) => {
            const container = this.scene.add.container(pos.x, pos.y)
            const body = this.scene.add.circle(
                0, 0, 22,
                colors[index]
            ).setStrokeStyle(3, 0x000000)
            const eye1 = this.scene.add.circle(-7, -5, 4, 0xffffff)
            const eye2 = this.scene.add.circle(7, -5, 4, 0xffffff)
            const pupil1 = this.scene.add.circle(-7, -5, 2, 0x000000)
            const pupil2 = this.scene.add.circle(7, -5, 2, 0x000000)
            container.add([body, eye1, eye2, pupil1, pupil2])
            container.setScrollFactor(0)
            this.add(container)

            this.guardians.push({
                container,
                x: pos.x,
                y: pos.y,
                vx: pos.vx,
                vy: pos.vy,
                speed: 100,
                stunned: false,
                stunTimer: 0
            })
        })
    }

    private createPearls(): void {
        const positions = [
            { x: 400, y: 400 },
            { x: 600, y: 600 },
            { x: 800, y: 300 },
            { x: 1000, y: 500 },
            { x: 1200, y: 700 },
            { x: 1400, y: 300 },
            { x: 1600, y: 500 },
            { x: 400, y: 800 },
            { x: 1600, y: 800 },
        ]

        for (const pos of positions) {
            const circle = this.scene.add.circle(
                pos.x, pos.y, 8,
                0xfff7df
            ).setStrokeStyle(2, 0xe88762)
            circle.setScrollFactor(0)
            this.add(circle)
            this.pearls.push({
                circle,
                x: pos.x,
                y: pos.y,
                collected: false
            })
        }
    }

    private createRuneKeys(): void {
        const positions = [
            { x: 500, y: 300 },
            { x: 1100, y: 700 },
            { x: 1600, y: 400 },
        ]

        for (const pos of positions) {
            const container = this.scene.add.container(pos.x, pos.y)
            const keyBody = this.scene.add.rectangle(
                0, 0, 20, 30,
                0xffd700
            ).setStrokeStyle(2, 0xffaa00)
            const keyRing = this.scene.add.circle(
                0, -15, 8,
                0xffd700
            ).setStrokeStyle(2, 0xffaa00)
            container.add([keyBody, keyRing])
            container.setScrollFactor(0)
            this.add(container)

            this.runeKeys.push({
                container,
                x: pos.x,
                y: pos.y,
                collected: false
            })
        }
    }

    private createPortal(): void {
        this.portal = this.scene.add.container(960, 540)
        const portalCircle = this.scene.add.circle(
            0, 0, 40,
            0x6c5ce7, 0.5
        ).setStrokeStyle(3, 0xffffff)
        const portalInner = this.scene.add.circle(
            0, 0, 25,
            0x9b59b6, 0.7
        )
        this.portal.add([portalCircle, portalInner])
        this.portal.setScrollFactor(0)
        this.add(this.portal)

        // Animate portal
        this.scene.tweens.add({
            targets: this.portal,
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        })
    }

    private startGame(): void {
        this.isRunning = true
        this.scene.events.on('update', this.update, this)
    }

    private update(): void {
        if (!this.isRunning || this.isGameOver) return

        // Move player with arrow keys
        const speed = 180
        let dx = 0
        let dy = 0
        if (this.cursors.left.isDown) dx = -1
        if (this.cursors.right.isDown) dx = 1
        if (this.cursors.up.isDown) dy = -1
        if (this.cursors.down.isDown) dy = 1

        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy)
            const newX = this.player.x + (dx / len) * speed * (1 / 60)
            const newY = this.player.y + (dy / len) * speed * (1 / 60)

            // Check wall collisions
            let canMove = true
            for (const wall of this.walls) {
                const wallBounds = new Phaser.Geom.Rectangle(
                    wall.x - wall.width / 2,
                    wall.y - wall.height / 2,
                    wall.width,
                    wall.height
                )
                const playerBounds = new Phaser.Geom.Rectangle(
                    newX - 15, newY - 15, 30, 30
                )
                if (Phaser.Geom.Intersects.RectangleToRectangle(wallBounds, playerBounds)) {
                    canMove = false
                    break
                }
            }

            // Check rubble collisions (need harpoon to break)
            for (let i = this.rubble.length - 1; i >= 0; i--) {
                const rubble = this.rubble[i]
                const rubbleBounds = new Phaser.Geom.Rectangle(
                    rubble.x - rubble.width / 2,
                    rubble.y - rubble.height / 2,
                    rubble.width,
                    rubble.height
                )
                const playerBounds = new Phaser.Geom.Rectangle(
                    newX - 15, newY - 15, 30, 30
                )
                if (Phaser.Geom.Intersects.RectangleToRectangle(rubbleBounds, playerBounds)) {
                    // Can't pass through rubble
                    canMove = false
                    break
                }
            }

            if (canMove) {
                this.player.x = newX
                this.player.y = newY
            }
        }

        // Clamp player to bounds
        this.player.x = Phaser.Math.Clamp(this.player.x, 120, 1780)
        this.player.y = Phaser.Math.Clamp(this.player.y, 220, 860)

        // Oxygen drain
        this.oxygen -= 0.5 * (1 / 60) // ~0.5% per second
        if (this.oxygen <= 0) {
            this.oxygen = 0
            this.lose()
            return
        }
        this.oxygenText.setText(`Кислород: ${Math.ceil(this.oxygen)}%`)

        // Collect pearls
        for (let i = this.pearls.length - 1; i >= 0; i--) {
            const pearl = this.pearls[i]
            if (pearl.collected) continue
            const dist = Phaser.Math.Distance.Between(
                pearl.x, pearl.y,
                this.player.x, this.player.y
            )
            if (dist < 30) {
                pearl.collected = true
                pearl.circle.destroy()
                this.pearls.splice(i, 1)
                this.oxygen = Math.min(this.maxOxygen, this.oxygen + 20)
                this.oxygenText.setText(`Кислород: ${Math.ceil(this.oxygen)}%`)
            }
        }

        // Collect rune keys
        for (let i = this.runeKeys.length - 1; i >= 0; i--) {
            const key = this.runeKeys[i]
            if (key.collected) continue
            const dist = Phaser.Math.Distance.Between(
                key.x, key.y,
                this.player.x, this.player.y
            )
            if (dist < 30) {
                key.collected = true
                key.container.destroy()
                this.runeKeys.splice(i, 1)
                this.keysCollected++
                this.keysText.setText(`Ключи: ${this.keysCollected}/${this.totalKeys}`)

                if (this.keysCollected >= this.totalKeys) {
                    this.portalActive = true
                    // Portal becomes brighter
                    this.portal.setAlpha(1)
                }
            }
        }

        // Check portal
        if (this.portalActive) {
            const dist = Phaser.Math.Distance.Between(
                this.portal.x, this.portal.y,
                this.player.x, this.player.y
            )
            if (dist < 50) {
                this.win()
                return
            }
        }

        // Move guardians
        for (const guardian of this.guardians) {
            if (guardian.stunned) {
                guardian.stunTimer -= 1 / 60
                if (guardian.stunTimer <= 0) {
                    guardian.stunned = false
                    guardian.container.setAlpha(1)
                }
                continue
            }

            guardian.x += guardian.vx * (1 / 60)
            guardian.y += guardian.vy * (1 / 60)

            // Bounce off walls
            if (guardian.x < 120 || guardian.x > 1780) guardian.vx *= -1
            if (guardian.y < 220 || guardian.y > 860) guardian.vy *= -1

            guardian.container.x = guardian.x
            guardian.container.y = guardian.y

            // Check collision with player
            const dist = Phaser.Math.Distance.Between(
                guardian.x, guardian.y,
                this.player.x, this.player.y
            )
            if (dist < 35) {
                // Lose 30% oxygen and get knocked back
                this.oxygen -= 30
                this.oxygenText.setText(`Кислород: ${Math.ceil(this.oxygen)}%`)

                // Knockback
                const knockDir = new Phaser.Math.Vector2(
                    this.player.x - guardian.x,
                    this.player.y - guardian.y
                ).normalize()
                this.player.x += knockDir.x * 50
                this.player.y += knockDir.y * 50

                if (this.oxygen <= 0) {
                    this.lose()
                    return
                }
            }
        }

        // Harpoon cooldown
        if (this.harpoonCooldown > 0) {
            this.harpoonCooldown -= 1 / 60
            this.harpoonText.setText(
                `Гарпун: ${this.harpoonCooldown.toFixed(1)}с`
            )
        } else {
            this.harpoonText.setText('Гарпун: готов (SPACE)')
            // Fire harpoon with space
            if (Phaser.Input.Keyboard.JustDown(
                this.scene.input.keyboard!.addKey(
                    Phaser.Input.Keyboard.KeyCodes.SPACE
                )
            )) {
                this.fireHarpoon()
            }
        }
    }

    private fireHarpoon(): void {
        if (this.harpoonCooldown > 0) return

        // Stun nearest guardian
        let nearest: Guardian | null = null
        let minDist = Infinity
        for (const guardian of this.guardians) {
            if (guardian.stunned) continue
            const dist = Phaser.Math.Distance.Between(
                guardian.x, guardian.y,
                this.player.x, this.player.y
            )
            if (dist < minDist) {
                minDist = dist
                nearest = guardian
            }
        }

        if (nearest && minDist < 300) {
            nearest.stunned = true
            nearest.stunTimer = 5
            nearest.container.setAlpha(0.5)
            this.harpoonCooldown = this.harpoonCooldownMax
            this.harpoonText.setText('Гарпун: перезарядка...')
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
        new Labyrinth(this.scene, this.options)
    }
}
