import Phaser from 'phaser'
import { UIModal } from './modal'
import { uiTextStyle } from './theme'
import { UI_TEXTURES } from './ui_assets'

export type ChapterState = 'completed' | 'current' | 'locked'

export interface NotebookChapterView {
    number: number
    title: string
    subtitle: string
    objective: string
    state: ChapterState
}

export class NotebookUI extends UIModal {
    constructor(scene: Phaser.Scene, chapters: NotebookChapterView[]) {
        super(scene, 'Дневник Мура', 'Наблюдения, цели и этапы исследования')

        chapters.slice(0, 5).forEach((chapter, index) => {
            const y = 365 + index * 98
            const marker = scene.add.image(
                480,
                y + 24,
                UI_TEXTURES.locationLabel
            ).setDisplaySize(70, 42)
                .setTint(
                    chapter.state === 'current'
                        ? 0xe88762
                        : chapter.state === 'completed'
                            ? 0x75a66f
                            : 0xffffff
                )
            const markerText = scene.add.text(
                480,
                y + 24,
                chapter.state === 'completed' ? '✓' : `${chapter.number}`,
                uiTextStyle(
                    19,
                    chapter.state === 'locked' ? '#52666b' : '#ffffff',
                    true
                )
            ).setOrigin(0.5)
            const title = scene.add.text(
                540,
                y,
                chapter.title,
                uiTextStyle(
                    23,
                    chapter.state === 'current' ? '#bd6047' : '#24343b',
                    true
                )
            )
            const subtitle = scene.add.text(
                540,
                y + 36,
                chapter.subtitle,
                uiTextStyle(18, '#607278')
            )
            const objective = scene.add.text(
                1000,
                y + 8,
                chapter.objective,
                {
                    ...uiTextStyle(18),
                    wordWrap: { width: 440 }
                }
            )
            this.content.add([marker, markerText, title, subtitle, objective])
        })
    }
}
