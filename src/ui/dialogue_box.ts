import Phaser from 'phaser'
import { UIButton } from './button'
import {
    UI_COLORS,
    uiTextStyle
} from './theme'
import { UI_TEXTURES } from './ui_assets'

export interface DialogueLine {
    speaker: string
    text: string
    portraitKey?: string
}

export interface DialogueBoxOptions {
    onNext?: () => void
    onClose?: () => void
}

export class DialogueBox extends Phaser.GameObjects.Container {
    private readonly speakerText: Phaser.GameObjects.Text
    private readonly bodyText: Phaser.GameObjects.Text
    private readonly portrait: Phaser.GameObjects.Image
    private readonly options: DialogueBoxOptions

    constructor(
        scene: Phaser.Scene,
        line: DialogueLine,
        options: DialogueBoxOptions = {}
    ) {
        super(scene, 0, 0)
        this.options = options
        scene.add.existing(this)
        this.setDepth(900)

        // Увеличенное диалоговое окно
        const panel = scene.add.image(
            960,
            920,
            UI_TEXTURES.modalBackground
        ).setDisplaySize(1400, 240)

        const portraitTexture = line.portraitKey &&
            scene.textures.exists(line.portraitKey)
            ? line.portraitKey
            : UI_TEXTURES.heroIcon
        this.portrait = scene.add.image(400, 915, portraitTexture)
            .setDisplaySize(130, 130)

        this.speakerText = scene.add.text(
            510,
            830,
            '',
            uiTextStyle(22, '#bd6047', true)
        )
        this.bodyText = scene.add.text(
            510,
            875,
            '',
            {
                ...uiTextStyle(28),
                wordWrap: { width: 1100 },
                lineSpacing: 10
            }
        )
        const next = new UIButton(scene, 1430, 960, {
            width: 130,
            height: 52,
            label: 'Далее',
            fill: UI_COLORS.sun,
            onClick: () => {
                this.options.onNext?.()
                if (!this.options.onNext) this.close()
            },
            fontSize: 20
        })

        this.add([
            panel,
            this.portrait,
            this.speakerText,
            this.bodyText,
            next
        ])
        this.setLine(line)

        const escape = scene.input.keyboard?.on('keydown-ESC', () => this.close())
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            if (escape) scene.input.keyboard?.off('keydown-ESC')
        })
    }

    setLine(line: DialogueLine) {
        this.speakerText.setText(line.speaker.toUpperCase())
        this.bodyText.setText(line.text)
        return this
    }

    close() {
        this.options.onClose?.()
        this.destroy()
    }
}
