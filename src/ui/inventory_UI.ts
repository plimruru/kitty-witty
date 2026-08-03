import Phaser from 'phaser'
import { UIModal } from './modal'
import { uiTextStyle } from './theme'
import { UI_TEXTURES } from './ui_assets'

export interface InventorySlotView {
    id: string
    name: string
    description: string
    found: boolean
    locationHint?: string
    iconKey?: string
    color?: number
}

export interface InventoryUIOptions {
    slots: InventorySlotView[]
    onSelect?: (itemId: string) => void
}

export class InventoryUI extends UIModal {
    constructor(scene: Phaser.Scene, options: InventoryUIOptions) {
        super(
            scene,
            'Рюкзак',
            'Найденные предметы',
            { backgroundTexture: UI_TEXTURES.inventoryWindow }
        )

        const positions = [
            { x: 600, y: 493 },
            { x: 840, y: 493 },
            { x: 1080, y: 493 },
            { x: 1320, y: 493 },
            { x: 600, y: 710 },
            { x: 840, y: 710 },
            { x: 1080, y: 710 },
            { x: 1320, y: 710 }
        ]

        positions.forEach((position, index) => {
            const slot = options.slots[index]
            if (!slot) return
            this.createSlot(slot, position.x, position.y, options.onSelect)
        })
    }

    private createSlot(
        slot: InventorySlotView,
        x: number,
        y: number,
        onSelect?: (itemId: string) => void
    ) {
        const icon = slot.found &&
            slot.iconKey &&
            this.scene.textures.exists(slot.iconKey)
            ? this.scene.add.image(x, y - 12, slot.iconKey).setDisplaySize(98, 98)
            : undefined
        const placeholder = slot.found && !icon
            ? this.scene.add.text(
                x,
                y - 18,
                '?',
                uiTextStyle(52, '#8b5755', true)
            ).setOrigin(0.5)
            : undefined
        const name = this.scene.add.text(
            x,
            y + 72,
            slot.found ? slot.name : '',
            {
                ...uiTextStyle(15, '#684d4b', true),
                align: 'center',
                wordWrap: { width: 156 }
            }
        ).setOrigin(0.5)
        const hit = this.scene.add.rectangle(
            x - 88,
            y - 88,
            176,
            176,
            0xffffff,
            0.001
        ).setOrigin(0).setInteractive({ useHandCursor: slot.found })
        hit.on('pointerdown', () => {
            if (slot.found) onSelect?.(slot.id)
        })

        this.content.add([
            ...(icon ? [icon] : []),
            ...(placeholder ? [placeholder] : []),
            name,
            hit
        ])
    }
}
