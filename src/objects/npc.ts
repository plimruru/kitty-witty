import Phaser from 'phaser'
import { UI_COLORS } from '../ui/theme'

export interface NPCOptions {
    x: number
    y: number
    scale?: number
    color?: string
    name?: string
    /** Ключ текстуры для отображения (если есть) */
    textureKey?: string
    /** Цвет для программной генерации */
    bodyColor?: number
}

/**
 * Визуальный NPC — персонаж, отображаемый поверх фонового изображения.
 * Рисуется программно в стиле Goose Goose Duck (крупные формы, чёрные контуры).
 */
export class NPC extends Phaser.GameObjects.Container {
    private nameText: Phaser.GameObjects.Text | null = null

    constructor(scene: Phaser.Scene, options: NPCOptions) {
        super(scene, options.x, options.y)
        scene.add.existing(this)
        this.setDepth(50)

        const scale = options.scale ?? 1

        // Если есть текстура — используем её
        if (options.textureKey && scene.textures.exists(options.textureKey)) {
            const img = scene.add.image(0, 0, options.textureKey)
            img.setScale(scale)
            this.add(img)
        } else {
            // Иначе рисуем персонажа программно
            this.drawProgrammaticNPC(scene, options.bodyColor ?? 0xf5a623, scale)
        }

        // Имя над персонажем
        if (options.name) {
            this.nameText = scene.add.text(
                0,
                -70 * scale,
                options.name,
                {
                    fontFamily: '"Galmuri7", "Courier New", monospace',
                    fontSize: `${16 * scale}px`,
                    color: '#ffffff',
                    backgroundColor: '#24343bcc',
                    padding: { x: 8, y: 4 }
                }
            ).setOrigin(0.5)
            this.add(this.nameText)
        }
    }

    private drawProgrammaticNPC(
        scene: Phaser.Scene,
        color: number,
        scale: number
    ) {
        // Body (oval)
        const body = scene.add.ellipse(
            0, 30 * scale, 60 * scale, 40 * scale,
            color
        ).setStrokeStyle(3 * scale, 0x000000)
        this.add(body)

        // Head (big circle)
        const head = scene.add.circle(
            0, -10 * scale, 30 * scale,
            color
        ).setStrokeStyle(3 * scale, 0x000000)
        this.add(head)

        // Ears (triangles)
        const earLeft = scene.add.triangle(
            -18 * scale, -28 * scale,
            0, 0,
            -18 * scale, -45 * scale,
            -5 * scale, -35 * scale,
            color
        ).setStrokeStyle(2 * scale, 0x000000)
        this.add(earLeft)

        const earRight = scene.add.triangle(
            18 * scale, -28 * scale,
            0, 0,
            18 * scale, -45 * scale,
            5 * scale, -35 * scale,
            color
        ).setStrokeStyle(2 * scale, 0x000000)
        this.add(earRight)

        // Eyes
        const eyeLeft = scene.add.circle(
            -10 * scale, -15 * scale, 7 * scale,
            0xffffff
        ).setStrokeStyle(2 * scale, 0x000000)
        this.add(eyeLeft)

        const eyeRight = scene.add.circle(
            10 * scale, -15 * scale, 7 * scale,
            0xffffff
        ).setStrokeStyle(2 * scale, 0x000000)
        this.add(eyeRight)

        // Pupils
        const pupilLeft = scene.add.circle(
            -10 * scale, -15 * scale, 3 * scale,
            0x000000
        )
        this.add(pupilLeft)

        const pupilRight = scene.add.circle(
            10 * scale, -15 * scale, 3 * scale,
            0x000000
        )
        this.add(pupilRight)

        // Nose
        const nose = scene.add.circle(
            0, -2 * scale, 4 * scale,
            0xe88762
        ).setStrokeStyle(1 * scale, 0x000000)
        this.add(nose)
    }

    /** Показывает имя */
    showName() {
        if (this.nameText) this.nameText.setVisible(true)
    }

    /** Скрывает имя */
    hideName() {
        if (this.nameText) this.nameText.setVisible(false)
    }
}
