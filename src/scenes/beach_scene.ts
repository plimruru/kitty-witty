import { BaseScene } from './base_scene'
import { MiniGameFactory, MiniGameType } from '../minigames'
import { inventoryManager } from '../managers/inventory_manager'
import { journalManager } from '../managers/journal_manager'
import { setGameUIState } from '../ui'

export class Beach extends BaseScene {
    constructor() {
        super(
            'beach',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'beach',
                    path: 'beach.png'
                },
                playerScale: 1,
                locationScale: 1.30,
                // scrollable: true — чтобы можно было дойти до входа в море
                scrollable: true,
                obstacles: [

                    {
                        x: 41,
                        y: 557,
                        width: 1953,
                        height: 225
                    },

                    {
                        x: 1989,
                        y: 748,
                        width: 363,
                        height: 56
                    },

                    {
                        x: 2271,
                        y: 671,
                        width: 76,
                        height: 74
                    },

                    {
                        x: 30,
                        y: 475,
                        width: 81,
                        height: 120
                    },

                    {
                        x: 122,
                        y: 493,
                        width: 76,
                        height: 79
                    },

                    {
                        x: 174,
                        y: 527,
                        width: 877,
                        height: 95
                    },

                    {
                        x: 39,
                        y: 428,
                        width: 53,
                        height: 53
                    },

                    {
                        x: 408,
                        y: 497,
                        width: 188,
                        height: 40
                    },

                    {
                        x: 608,
                        y: 555,
                        width: 102,
                        height: 28
                    },

                    {
                        x: 687,
                        y: 493,
                        width: 279,
                        height: 66
                    },

                    {
                        x: 776,
                        y: 466,
                        width: 96,
                        height: 32
                    },

                    {
                        x: 1357,
                        y: 524,
                        width: 347,
                        height: 74
                    },

                    {
                        x: 1438,
                        y: 500,
                        width: 186,
                        height: 31
                    },

                    {
                        x: 1487,
                        y: 482,
                        width: 98,
                        height: 37
                    },

                    {
                        x: 1672,
                        y: 524,
                        width: 325,
                        height: 50
                    },

                    {
                        x: 1719,
                        y: 498,
                        width: 284,
                        height: 53
                    },

                    {
                        x: 1785,
                        y: 484,
                        width: 141,
                        height: 31
                    },

                    {
                        x: 1815,
                        y: 471,
                        width: 71,
                        height: 28
                    },

                    {
                        x: 166,
                        y: 235,
                        width: 193,
                        height: 231
                    },

                    {
                        x: 619,
                        y: 42,
                        width: 181,
                        height: 118
                    },

                    {
                        x: 1143,
                        y: 393,
                        width: 98,
                        height: 99
                    },

                    {
                        x: 1543,
                        y: 120,
                        width: 187,
                        height: 225
                    },

                    {
                        x: 1842,
                        y: 144,
                        width: 115,
                        height: 47
                    },

                    {
                        x: 1889,
                        y: 271,
                        width: 90,
                        height: 181
                    },

                    {
                        x: 2129,
                        y: 376,
                        width: 146,
                        height: 133
                    },

                    {
                        x: 149,
                        y: 76,
                        width: 136,
                        height: 55
                    }
                ]
            }
        )
    }

    create() {
        super.create()

        // 🐚 Продавец ракушек — чуть выше центра, чтобы окно мини-игры было по центру
        this.addInteractionZone(
            800, 350, 100, 80,
            () => this.startArkanoid(),
            'Поговорить с продавцом ракушек'
        )

        // 👤 Визуальный NPC — продавец ракушек
        this.addNPC(
            800, 350,
            {
                name: 'Продавец ракушек',
                color: 0xe88762
            }
        )

        // 🌊 Переход в море (доступен после сборки костюма)
        this.addInteractionZone(
            2200, 600, 120, 100,
            () => this.tryEnterSea(),
            'Войти в море'
        )

        // 🚪 Визуальный маркер входа в море
        this.addLocationExit(
            2200, 600,
            'В море',
            {
                color: 0x4d9290,
                locked: !inventoryManager.isSuitAssembled()
            }
        )

        // 🚪 Вход в школу
        this.addLocationExit(
            100, 300,
            'В школу',
            { color: 0xf3c969 }
        )
    }

    private startArkanoid() {
        const ui = this.getGameUI()

        const dialogue = ui.showDialogue(this, {
            speaker: 'Продавец ракушек',
            text: 'Ласты и перчатки? Помоги разбить ракушки для моего лотка — и они твои!'
        }, {
            onNext: () => {
                dialogue.close()
                this.launchArkanoid()
            }
        })
    }

    private launchArkanoid() {
        const ui = this.getGameUI()

        MiniGameFactory.create(this, MiniGameType.ARKANOID, {
            onComplete: () => {
                // Добавляем награды в инвентарь
                inventoryManager.addItem('flippers')
                inventoryManager.addItem('gloves')
                journalManager.completeChapter(2)

                // Обновляем UI-состояние с иконками предметов
                setGameUIState(this, {
                    inventory: inventoryManager.getAllItems().map(item => ({
                        id: item.id,
                        name: item.name,
                        description: item.collected ? 'Найден' : 'Не найден',
                        found: item.collected,
                        iconKey: item.collected ? item.textureKey : undefined
                    })),
                    notebook: journalManager.getChapterView(),
                    unlockedLocations: ['classroom', 'beach', 'children_room', 'garage']
                })

                ui.showToast(this, 'Ласты и перчатки получены!', journalManager.getGrandpaStory('flippers'))
            },
            onFail: () => {
                // Можно переиграть
            }
        })
    }

    private tryEnterSea() {
        const ui = this.getGameUI()

        if (inventoryManager.isSuitAssembled()) {
            this.scene.start('sea')
        } else {
            ui.showToast(this, 'Костюм не собран!', 'Собери все части водолазного костюма, чтобы войти в море!')
        }
    }
}
