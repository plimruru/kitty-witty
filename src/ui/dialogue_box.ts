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

        const panel = scene.add.image(
            960,
            920,
            UI_TEXTURES.modalBackground
        ).setDisplaySize(1250, 200)

        const portraitTexture = line.portraitKey &&
            scene.textures.exists(line.portraitKey)
            ? line.portraitKey
            : UI_TEXTURES.heroIcon
        this.portrait = scene.add.image(440, 915, portraitTexture)
            .setDisplaySize(118, 118)

        this.speakerText = scene.add.text(
            530,
            850,
            '',
            uiTextStyle(20, '#bd6047', true)
        )
        this.bodyText = scene.add.text(
            530,
            890,
            '',
            {
                ...uiTextStyle(26),
                wordWrap: { width: 930 },
                lineSpacing: 7
            }
        )
        const next = new UIButton(scene, 1430, 948, {
            width: 112,
            height: 48,
            label: 'Далее',
            fill: UI_COLORS.sun,
            onClick: () => {
                this.options.onNext?.()
                if (!this.options.onNext) this.close()
            },
            fontSize: 19
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
