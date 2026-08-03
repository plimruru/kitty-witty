import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from './theme'

export interface InteractionMarkerOptions {
    label: string
    state?: 'available' | 'completed' | 'locked'
    onInspect: () => void
}

export class InteractionMarker extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        options: InteractionMarkerOptions
    ) {
        super(scene, x, y)
        scene.add.existing(this)
        this.setDepth(100)

        const state = options.state ?? 'available'
        const color = state === 'completed'
            ? UI_COLORS.success
            : state === 'locked'
                ? UI_COLORS.inkSoft
                : UI_COLORS.sun
        const pulse = scene.add.rectangle(0, 0, 78, 78, color, 0.2)
        const circle = scene.add.rectangle(0, 0, 54, 54, color, state === 'locked' ? 0.55 : 0.95)
            .setStrokeStyle(4, UI_COLORS.paper, 0.95)
        const mark = scene.add.text(
            0,
            -1,
            state === 'completed' ? '✓' : state === 'locked' ? '–' : '?',
            uiTextStyle(25, state === 'completed' ? '#ffffff' : '#24343b', true)
        ).setOrigin(0.5)
        const label = scene.add.text(
            0,
            49,
            options.label,
            {
                ...uiTextStyle(16, '#ffffff', true),
                backgroundColor: '#24343bdd',
                padding: { x: 9, y: 5 }
            }
        ).setOrigin(0.5, 0)
        const hit = scene.add.rectangle(0, 0, 88, 88, UI_COLORS.white, 0.001)
            .setInteractive({ useHandCursor: state !== 'locked' })

        if (state === 'available') {
            scene.tweens.add({
                targets: pulse,
                scale: 1.4,
                alpha: 0,
                duration: 1200,
                repeat: -1
            })
        } else {
            pulse.setVisible(false)
        }

        hit.on('pointerover', () => {
            if (state !== 'locked') this.setScale(1.08)
        })
        hit.on('pointerout', () => this.setScale(1))
        hit.on('pointerdown', () => {
            if (state !== 'locked') options.onInspect()
        })
        this.add([pulse, circle, mark, label, hit])
    }
}
