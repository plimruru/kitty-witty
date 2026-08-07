import { BaseScene } from './base_scene'
import { MiniGameFactory, MiniGameType } from '../minigames'
import { inventoryManager } from '../managers/inventory_manager'
import { journalManager } from '../managers/journal_manager'
import { setGameUIState } from '../ui'

export class Sea extends BaseScene {
    constructor() {
        super(
            'sea',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'sea',
                    path: 'sea.png'
                },
                playerScale: 1,
                locationScale: 1.30,
                scrollable: true,
                obstacles: [
                    {
                        x: 740,
                        y: 110,
                        width: 1605,
                        height: 205
                    },

                    {
                        x: 1694,
                        y: 300,
                        width: 322,
                        height: 233
                    },

                    {
                        x: 29,
                        y: 26,
                        width: 710,
                        height: 228
                    },

                    {
                        x: 1539,
                        y: 279,
                        width: 53,
                        height: 62
                    },

                    {
                        x: 20,
                        y: 25,
                        width: 74,
                        height: 772
                    },

                    {
                        x: 95,
                        y: 387,
                        width: 87,
                        height: 183
                    },

                    {
                        x: 23,
                        y: 769,
                        width: 2330,
                        height: 56
                    },

                    {
                        x: 32,
                        y: 703,
                        width: 1016,
                        height: 704
                    },

                    {
                        x: 272,
                        y: 670,
                        width: 431,
                        height: 35
                    },

                    {
                        x: 450,
                        y: 515,
                        width: 260,
                        height: 163
                    },

                    {
                        x: 1205,
                        y: 445,
                        width: 264,
                        height: 352
                    },

                    {
                        x: 1022,
                        y: 445,
                        width: 174,
                        height: 187
                    },

                    {
                        x: 1473,
                        y: 673,
                        width: 154,
                        height: 132
                    },

                    {
                        x: 1927,
                        y: 639,
                        width: 406,
                        height: 165
                    },

                    {
                        x: 1961,
                        y: 611,
                        width: 368,
                        height: 20
                    },

                    {
                        x: 2188,
                        y: 515,
                        width: 154,
                        height: 98
                    },

                    {
                        x: 2188,
                        y: 515,
                        width: 154,
                        height: 98
                    }
                ]
            }
        )
    }

    create() {
        super.create()

        // Показываем приветствие при входе в море
        if (inventoryManager.isSuitAssembled()) {
            this.getGameUI().showToast(
                this,
                '🌊 Добро пожаловать в море!',
                'Ты в полном водолазном костюме! Найди вход в Атлантиду!'
            )
        }

        // Вход в подводный лабиринт
        this.addInteractionZone(
            1500, 500, 120, 100,
            () => this.startLabyrinth(),
            'Войти в подводный лабиринт'
        )

        // 🚪 Визуальный маркер входа в лабиринт
        this.addLocationExit(
            1500, 500,
            'В лабиринт',
            { color: 0x6c5ce7 }
        )

        // 🚪 Обратный переход на пляж
        this.addLocationExit(
            100, 500,
            'На пляж',
            { color: 0xf3c969 }
        )
    }

    private startLabyrinth() {
        const ui = this.getGameUI()

        const dialogue = ui.showDialogue(this, {
            speaker: 'Мур',
            text: 'Впереди подводный лабиринт! Мне нужно найти 3 рунных ключа и добраться до портала в Атлантиду!'
        }, {
            onNext: () => {
                dialogue.close()
                this.launchLabyrinth()
            }
        })
    }

    private launchLabyrinth() {
        const ui = this.getGameUI()

        MiniGameFactory.create(this, MiniGameType.LABYRINTH, {
            onComplete: () => {
                journalManager.completeChapter(5)

                // Обновляем UI-состояние
                setGameUIState(this, {
                    inventory: inventoryManager.getAllItems().map(item => ({
                        id: item.id,
                        name: item.name,
                        description: item.collected ? 'Найден' : 'Не найден',
                        found: item.collected,
                        iconKey: item.collected ? item.textureKey : undefined
                    })),
                    notebook: journalManager.getChapterView(),
                    unlockedLocations: ['classroom', 'beach', 'children_room', 'garage', 'sea']
                })

                // Финальная кат-сцена
                this.showFinalCutscene()
            },
            onFail: () => {
                ui.showToast(this, 'Кислород закончился!', 'Попробуй ещё раз!')
            }
        })
    }

    private showFinalCutscene() {
        const ui = this.getGameUI()

        // Финальная кат-сцена: послание дедушки
        const dialogue = ui.showDialogue(this, {
            speaker: 'Дедушка Мур',
            text: 'Мой дорогой внук! Если ты читаешь это — значит, ты нашёл Атлантиду. Я всегда верил, что любопытство и смелость — лучшие качества исследователя. Береги себя и свою семью. С любовью, дедушка.'
        }, {
            onNext: () => {
                dialogue.close()
                this.showReconciliation()
            }
        })
    }

    private showReconciliation() {
        const ui = this.getGameUI()

        const dialogue = ui.showDialogue(this, {
            speaker: 'Мама',
            text: 'Мур... Я так боялась потерять тебя, как потеряла папу. Но теперь я вижу, что твоя страсть к морю — это его наследие. Я горжусь тобой!'
        }, {
            onNext: () => {
                dialogue.close()
                this.showFinalTitle()
            }
        })
    }

    private showFinalTitle() {
        const ui = this.getGameUI()

        // Финальные титры
        ui.showToast(this, '🎉 АТЛАНТИДА НАЙДЕНА!', 'Спасибо за игру! Kitty Witty: Кот-водолаз и тайны Атлантиды')
    }
}
