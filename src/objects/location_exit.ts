import Phaser from 'phaser'
import { UI_COLORS } from '../ui/theme'

export interface LocationExitOptions {
    x: number
    y: number
    label: string
    /** Цвет стрелки */
    color?: number
    /** Размер маркера */
    scale?: number
    /** Показывать ли маркер (если локация заблокирована) */
    locked?: boolean
}

/**
 * Визуальный маркер входа в локацию.
 * Показывает стрелку/дверь с подписью, чтобы игрок знал, куда идти.
 */
export class LocationExit extends Phaser.GameObjects.Container {
    private arrow: Phaser.GameObjects.Triangle
    private labelText: Phaser.GameObjects.Text
    private locked: boolean

    constructor(scene: Phaser.Scene, options: LocationExitOptions) {
        super(scene, options.x, options.y)
        scene.add.existing(this)
        this.setDepth(40)

        this.locked = options.locked ?? false
        const scale = options.scale ?? 1
        const color = options.color ?? (this.locked ? 0x888888 : UI_COLORS.coral)

        // Стрелка-указатель
        this.arrow = scene.add.triangle(
            0, 0,
            0, -25 * scale,
            25 * scale, 0,
            0, 25 * scale,
            color
        ).setStrokeStyle(3 * scale, 0x000000)
        this.add(this.arrow)

        // Подпись
        this.labelText = scene.add.text(
            0,
            35 * scale,
            options.label,
            {
                fontFamily: '"Galmuri7", "Courier New", monospace',
                fontSize: `${18 * scale}px`,
                color: this.locked ? '#888888' : '#ffffff',
                backgroundColor: this.locked ? '#555555cc' : '#24343bcc',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5)
        this.add(this.labelText)

        // Анимация пульсации
        scene.tweens.add({
            targets: this.arrow,
            y: -5 * scale,
            duration: 800,
            yoyo: true,
            repeat: -1
        })
    }

    /** Открывает/закрывает локацию */
    setLocked(locked: boolean) {
        this.locked = locked
        const color = locked ? 0x888888 : UI_COLORS.coral
        this.arrow.setFillStyle(color)
        this.labelText.setColor(locked ? '#888888' : '#ffffff')
        this.labelText.setBackgroundColor(locked ? '#555555cc' : '#24343bcc')
    }

    isLocked(): boolean {
        return this.locked
    }
}
