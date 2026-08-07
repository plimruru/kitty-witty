import Phaser from 'phaser'
import { UIButton } from './button'
import { UI_COLORS, uiTextStyle } from './theme'
import { UI_TEXTURES } from './ui_assets'

export interface ChoiceView {
    id: string
    label: string
    disabled?: boolean
}

export class ChoiceMenu extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        prompt: string,
        choices: ChoiceView[],
        onChoose: (choiceId: string) => void
    ) {
        super(scene, 0, 0)
        scene.add.existing(this)
        this.setDepth(950)

        const panelHeight = 110 + choices.length * 72
        const panel = scene.add.image(
            960,
            310 + panelHeight / 2,
            UI_TEXTURES.modalBackground
        ).setDisplaySize(800, panelHeight)
        const question = scene.add.text(
            610,
            350,
            prompt,
            {
                ...uiTextStyle(25, '#24343b', true),
                wordWrap: { width: 700 }
            }
        )
        this.add([panel, question])

        choices.forEach((choice, index) => {
            const button = new UIButton(scene, 610, 420 + index * 72, {
                width: 700,
                height: 58,
                label: choice.label,
                fill: index === 0 ? UI_COLORS.sun : UI_COLORS.paperDark,
                disabled: choice.disabled,
                onClick: () => onChoose(choice.id),
                fontSize: 19
            })
            this.add(button)
        })
    }
}
