import Phaser from 'phaser'
import { GameUI } from './game_ui'
import {
    DEFAULT_MAP_LOCATIONS,
    queueUiMap
} from './location_menu'
import { loadPixelFont, UI_COLORS } from './theme'
import { queueUiAssets, UI_TEXTURES } from './ui_assets'

class UIShowcaseScene extends Phaser.Scene {
    constructor() {
        super('ui-showcase')
    }

    preload() {
        this.load.setPath('/assets/')
        this.load.image('preview-classroom', 'classroom.png')
        this.load.image('preview-hero', 'hero.png')
        queueUiAssets(this)
        queueUiMap(this)
    }

    create() {
        this.cameras.main.setBackgroundColor(UI_COLORS.seaDark)
        this.createSidePanels()

        this.add.image(960, 540, 'preview-classroom')
            .setDisplaySize(1080, 1080)

        this.add.image(960, 630, UI_TEXTURES.heroIcon)
            .setScale(1.25)

        let ui: GameUI
        ui = new GameUI(
            this,
            {
                onInventory: () => ui.showInventory(
                    this,
                    {
                        slots: [
                            {
                                id: 'notes',
                                name: 'Конспект',
                                description: 'Под водой нужен запас воздуха.',
                                found: true,
                                color: 0x416d91
                            },
                            {
                                id: 'raincoat',
                                name: 'Дождевик',
                                description: '',
                                found: false
                            },
                            {
                                id: 'hose',
                                name: 'Шланг',
                                description: '',
                                found: false
                            },
                            {
                                id: 'aquarium',
                                name: 'Аквариум',
                                description: '',
                                found: false
                            },
                            {
                                id: 'straps',
                                name: 'Ремни',
                                description: '',
                                found: false
                            }
                        ]
                    }
                ),
                onMap: () => ui.showLocations(
                    this,
                    {
                        locations: DEFAULT_MAP_LOCATIONS.map((location) => ({
                            ...location,
                            current: location.key === 'classroom'
                        })),
                        onSelect: (sceneKey) => {
                            ui.showToast(this, 'Быстрый переход', sceneKey)
                        }
                    }
                ),
                onJournal: () => ui.showNotebook(
                    this,
                    [
                        {
                            number: 1,
                            title: 'Вопрос глубже моря',
                            subtitle: 'Урок окружающего мира',
                            objective: 'Понять причину опасности',
                            state: 'current'
                        },
                        {
                            number: 2,
                            title: 'Безопасный план',
                            subtitle: 'Разговор с родителями',
                            objective: 'Продумать защиту',
                            state: 'locked'
                        },
                        {
                            number: 3,
                            title: 'Пять находок',
                            subtitle: 'Исследование города',
                            objective: 'Собрать детали',
                            state: 'locked'
                        }
                    ]
                )
            }
        )
    }

    private createSidePanels() {
        this.add.tileSprite(
            210,
            540,
            420,
            1080,
            UI_TEXTURES.modalBackground
        ).setTint(UI_COLORS.seaDark).setAlpha(0.82)
        this.add.tileSprite(
            1710,
            540,
            420,
            1080,
            UI_TEXTURES.modalBackground
        ).setTint(UI_COLORS.seaDark).setAlpha(0.82)
    }
}

await loadPixelFont()

new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'preview-game',
    width: 1920,
    height: 1080,
    backgroundColor: '#2f6f73',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [UIShowcaseScene]
})
