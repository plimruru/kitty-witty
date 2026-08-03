import Phaser from 'phaser'
import { Player } from '../objects/player'
import { Rectangle } from '../objects/geometry'
import {
    FONT_SIZE,
    PLAYER_SPEED
} from '../utils/constants'
import {
    DEFAULT_MAP_LOCATIONS,
    GameUI,
    getGameUIState,
    getMapLocationsForScene,
    queueUiAssets,
    queueUiMap
} from '../ui'

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

export class BaseScene extends Phaser.Scene {
    private player!: Player
    private location!: Phaser.GameObjects.Image
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private config!: SceneConfig
    private ui!: GameUI

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

        //this.player.setCollideWorldBounds(false)

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

        this.add.text(
            50,
            50,
            this.config.sceneImage.key,
            {
                fontSize: `${FONT_SIZE}px`
            }
        )

        this.createObstacles()
        this.createGameUI()
    }

    update() {
        if (this.ui?.isOverlayOpen) {
            this.player.setVelocity(0, 0)
            return
        }

        const velocity = new Phaser.Math.Vector2(0, 0)

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

        //this.constraintPlayerToBounds()
        if (!this.config.scrollable) {
            this.constraintPlayerToBounds()
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
