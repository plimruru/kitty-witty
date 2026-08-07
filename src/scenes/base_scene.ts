import Phaser from 'phaser'
import { Player } from '../objects/player'
import { Rectangle } from '../objects/geometry'
import { NPC } from '../objects/npc'
import { LocationExit } from '../objects/location_exit'
import {
    PLAYER_SPEED
} from '../utils/constants'
import {
    DEFAULT_MAP_LOCATIONS,
    GameUI,
    getGameUIState,
    getMapLocationsForScene,
    queueUiAssets,
    queueUiMap,
    uiTextStyle
} from '../ui'
import { MINI_GAME_ACTIVE_KEY } from '../minigames'
import { generateAllTextures } from '../utils/texture_generator'

export interface Image {
    key: string
    path: string
}

export interface SceneConfig {
    playerImage : Image,
    sceneImage : Image,
    playerScale : number,
    locationScale : number,
    obstacles: Rectangle[],
    scrollable?: boolean

}

export interface InteractionZone {
    x: number
    y: number
    width: number
    height: number
    onInteract: () => void
    promptText?: string
}

export class BaseScene extends Phaser.Scene {
    private player!: Player
    private location!: Phaser.GameObjects.Image
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private config!: SceneConfig
    private ui!: GameUI
    private interactionZones: InteractionZone[] = []
    private activeZone: InteractionZone | null = null
    private promptText: Phaser.GameObjects.Text | null = null
    private eKey: Phaser.Input.Keyboard.Key | null = null

    constructor(key: string, config: SceneConfig) {
        super(key)
        this.config = config
    }

    preload() {
        // UI-ресурсы нужно поставить в очередь до setPath('assets/').
        queueUiAssets(this)
        queueUiMap(this)

        this.load.setPath('assets/')
        this.load.image(
            this.config.sceneImage.key,
            this.config.sceneImage.path
        )
        this.load.image(
            this.config.playerImage.key,
            this.config.playerImage.path
        )
    }

    create() {
        // Генерируем программные текстуры (если файлы не загружены)
        generateAllTextures(this)

        const width = this.scale.width
        const height = this.scale.height
        this.location = this.add.image(
            width / 2,
            height / 2,
            this.config.sceneImage.key
        )
        this.location.setScale(this.config.locationScale)
        const worldWidth = this.location.displayWidth
        const worldHeight = this.location.displayHeight

        this.player = new Player(
            this,
            this.location.x,
            this.location.y,
            this.config.playerImage.key
        )
        this.player.setCollideWorldBounds(false)

        if (this.config.scrollable) {

            this.physics.world.setBounds(
                this.location.x - worldWidth / 2,
                this.location.y - worldHeight / 2,
                worldWidth,
                worldHeight
            )

            this.cameras.main.setBounds(
                this.location.x - worldWidth / 2,
                this.location.y - worldHeight / 2,
                worldWidth,
                worldHeight
            )

            this.cameras.main.startFollow(
                this.player,
                true,
                0.1,
                0.1
            )

            this.player.setCollideWorldBounds(true)
        }
        else {
            this.player.setCollideWorldBounds(false)
        }

        this.cursors =
            this.input.keyboard!.createCursorKeys()

        this.eKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.E
        )

        this.createObstacles()
        this.createGameUI()
    }

    update() {
        // Блокируем движение, если открыто модальное окно или мини-игра
        const isMiniGameActive = this.data.get(MINI_GAME_ACTIVE_KEY) === true
        if (this.ui?.isOverlayOpen || isMiniGameActive) {
            this.player.setVelocity(0, 0)
            this.hidePrompt()
            return
        }

        const velocity = new Phaser.Math.Vector2(0, 0)

        // Управление стрелками
        if (this.cursors.left.isDown) velocity.x = -1
        if (this.cursors.right.isDown) velocity.x = 1
        if (this.cursors.up.isDown) velocity.y = -1
        if (this.cursors.down.isDown) velocity.y = 1

        if (velocity.length() > 0) {
            velocity.normalize().scale(PLAYER_SPEED)
        }

        this.player.setVelocity(
            velocity.x,
            velocity.y
        )

        if (!this.config.scrollable) {
            this.constraintPlayerToBounds()
        }

        this.checkInteractionZones()

        if (this.eKey && Phaser.Input.Keyboard.JustDown(this.eKey)) {
            if (this.activeZone) {
                this.activeZone.onInteract()
            }
        }
    }

    /**
     * Добавляет зону взаимодействия (NPC, объект).
     * x, y — центр зоны в локальных координатах карты.
     */
    protected addInteractionZone(
        x: number,
        y: number,
        width: number,
        height: number,
        onInteract: () => void,
        promptText = 'Нажмите E'
    ) {
        this.interactionZones.push({
            x,
            y,
            width,
            height,
            onInteract,
            promptText
        })
    }

    /**
     * Преобразует локальные координаты карты в мировые.
     * x, y — центр объекта в локальных координатах карты.
     */
    protected localToWorld(x: number, y: number): { x: number, y: number } {
        const scale = this.config.locationScale
        const left = this.location.x - this.location.width / 2 * scale
        const top  = this.location.y - this.location.height / 2 * scale

        return {
            x: left + x * scale,
            y: top + y * scale
        }
    }

    /**
     * Добавляет визуального NPC на сцену.
     * x, y — центр NPC в локальных координатах карты.
     */
    protected addNPC(
        x: number,
        y: number,
        options: {
            name?: string
            color?: number
            textureKey?: string
            scale?: number
        } = {}
    ) {
        const world = this.localToWorld(x, y)

        return new NPC(this, {
            x: world.x,
            y: world.y,
            name: options.name,
            bodyColor: options.color ?? 0xf5a623,
            textureKey: options.textureKey,
            scale: options.scale ?? 1
        })
    }

    /**
     * Добавляет визуальный маркер входа в локацию.
     * x, y — центр маркера в локальных координатах карты.
     */
    protected addLocationExit(
        x: number,
        y: number,
        label: string,
        options: {
            color?: number
            scale?: number
            locked?: boolean
        } = {}
    ) {
        const world = this.localToWorld(x, y)

        return new LocationExit(this, {
            x: world.x,
            y: world.y,
            label,
            color: options.color,
            scale: options.scale,
            locked: options.locked
        })
    }

    protected getGameUI(): GameUI {
        return this.ui
    }

    private checkInteractionZones() {
        const scale = this.config.locationScale
        const left = this.location.x - this.location.width / 2 * scale
        const top = this.location.y - this.location.height / 2 * scale

        let foundZone: InteractionZone | null = null

        for (const zone of this.interactionZones) {
            // zone.x, zone.y — центр зоны (как передано в addInteractionZone)
            const zoneX = left + zone.x * scale
            const zoneY = top + zone.y * scale
            const zoneW = zone.width * scale
            const zoneH = zone.height * scale

            const playerX = this.player.x
            const playerY = this.player.y

            if (
                playerX >= zoneX - zoneW / 2 - 50 &&
                playerX <= zoneX + zoneW / 2 + 50 &&
                playerY >= zoneY - zoneH / 2 - 50 &&
                playerY <= zoneY + zoneH / 2 + 50
            ) {
                foundZone = zone
                break
            }
        }

        if (foundZone !== this.activeZone) {
            this.activeZone = foundZone
            if (foundZone) {
                this.showPrompt(foundZone.promptText ?? 'Нажмите E')
            } else {
                this.hidePrompt()
            }
        }
    }

    private showPrompt(text: string) {
        if (this.promptText) this.promptText.destroy()
        this.promptText = this.add.text(
            this.player.x,
            this.player.y - 60,
            `[E] ${text}`,
            {
                ...uiTextStyle(18, '#ffffff', true),
                backgroundColor: '#24343bcc',
                padding: { x: 10, y: 6 }
            }
        ).setOrigin(0.5).setDepth(500)
    }

    private hidePrompt() {
        if (this.promptText) {
            this.promptText.destroy()
            this.promptText = null
        }
    }

    private createGameUI() {
        this.ui = new GameUI(this, {
            onInventory: () => {
                const state = getGameUIState(this)
                this.ui.showInventory(this, { slots: state.inventory })
            },
            onMap: () => {
                const state = getGameUIState(this)
                const locations = getMapLocationsForScene(
                    this.scene.key,
                    DEFAULT_MAP_LOCATIONS,
                    state.unlockedLocations
                )
                this.ui.showLocations(this, {
                    locations,
                    onSelect: (sceneKey) => this.scene.start(sceneKey)
                })
            },
            onJournal: () => {
                const state = getGameUIState(this)
                this.ui.showNotebook(this, state.notebook)
            }
        })

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.ui.destroy()
        })
    }

    private constraintPlayerToBounds() {
        const left = this.location.x - this.location.displayWidth / 2
        const right = this.location.x + this.location.displayWidth / 2
        const top = this.location.y - this.location.displayHeight / 2
        const bottom = this.location.y + this.location.displayHeight / 2
        const playerHalfWidth = this.player.displayWidth / 2
        const playerHalfHeight = this.player.displayHeight / 2

        this.player.x = Phaser.Math.Clamp(
            this.player.x,
            left + playerHalfWidth,
            right - playerHalfWidth
        )
        this.player.y = Phaser.Math.Clamp(
            this.player.y,
            top + playerHalfHeight,
            bottom - playerHalfHeight
        )
    }

    private createObstacles() {
        const scale = this.config.locationScale

        const left = this.location.x - this.location.width / 2 * scale
        const top  = this.location.y - this.location.height / 2 * scale

        for (const rectangle of this.config.obstacles) {

            const obstacle = this.add.rectangle(
                left + rectangle.x * scale + rectangle.width * scale / 2,
                top  + rectangle.y * scale + rectangle.height * scale / 2,
                rectangle.width * scale,
                rectangle.height * scale
            )
            obstacle.setVisible(false)
            this.physics.add.existing(obstacle, true)
            this.physics.add.collider(this.player, obstacle)
        }
    }
}
