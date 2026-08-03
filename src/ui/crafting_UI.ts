import Phaser from 'phaser'
import { UIButton } from './button'
import { UIModal } from './modal'
import { UI_COLORS, uiTextStyle } from './theme'

export interface CraftingPartView {
    id: string
    name: string
    available: boolean
}

export interface CraftingUIOptions {
    parts: CraftingPartView[]
    recipeName: string
    canCraft: boolean
    onCraft: () => void
}

export class CraftingUI extends UIModal {
    constructor(scene: Phaser.Scene, options: CraftingUIOptions) {
        super(scene, 'Верстак', 'Проверка комплекта перед сборкой')

        const preview = scene.add.graphics()
        preview.fillStyle(UI_COLORS.sea, 0.12)
        preview.fillRect(490, 330, 390, 420)
        preview.lineStyle(4, UI_COLORS.sea, 0.35)
        preview.strokeRect(605, 358, 160, 160)
        preview.strokeRect(595, 530, 180, 170)

        const title = scene.add.text(
            1030,
            325,
            options.recipeName,
            uiTextStyle(29, '#24343b', true)
        )
        this.content.add([preview, title])

        options.parts.slice(0, 5).forEach((part, index) => {
            const y = 390 + index * 58
            const marker = scene.add.rectangle(
                1033,
                y - 3,
                30,
                30,
                part.available ? UI_COLORS.success : UI_COLORS.paperDark
            ).setOrigin(0)
            const check = scene.add.text(
                1048,
                y + 12,
                part.available ? '✓' : '–',
                uiTextStyle(15, part.available ? '#ffffff' : '#52666b', true)
            ).setOrigin(0.5)
            const name = scene.add.text(
                1082,
                y,
                part.name,
                uiTextStyle(20, part.available ? '#24343b' : '#7f8b8e')
            )
            this.content.add([marker, check, name])
        })

        const craft = new UIButton(scene, 1025, 710, {
            width: 365,
            height: 68,
            label: options.canCraft ? 'Собрать костюм' : 'Не хватает деталей',
            fill: options.canCraft ? UI_COLORS.sun : UI_COLORS.paperDark,
            disabled: !options.canCraft,
            onClick: options.onCraft
        })
        this.content.add(craft)
    }
}
