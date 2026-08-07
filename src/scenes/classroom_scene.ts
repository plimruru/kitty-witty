import { BaseScene } from './base_scene'
import { MiniGameFactory, MiniGameType } from '../minigames'
import { inventoryManager } from '../managers/inventory_manager'
import { journalManager } from '../managers/journal_manager'
import { setGameUIState } from '../ui'

export class Classroom extends BaseScene {
    constructor() {
        super(
            'classroom',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'classroom',
                    path: 'classroom.png'
                },
                playerScale: 1,
                locationScale: 1.35,
                obstacles: [
                    {
                        x: 218,
                        y: 384,
                        width: 89,
                        height: 90
                    },

                    {
                        x: 365,
                        y: 384,
                        width: 100,
                        height: 90
                    },

                    {
                        x: 524,
                        y: 384,
                        width: 100,
                        height: 90
                    },

                    {
                        x: 524,
                        y: 512,
                        width: 104,
                        height: 90
                    },

                    {
                        x: 363,
                        y: 512,
                        width: 104,
                        height: 90
                    },

                    {
                        x: 204,
                        y: 501,
                        width: 104,
                        height: 104
                    },

                    {
                        x: 525,
                        y: 638,
                        width: 100,
                        height: 90
                    },

                    {
                        x: 216,
                        y: 638,
                        width: 89,
                        height: 90
                    },
                    
                    {
                        x: 35,
                        y: 302,
                        width: 57,
                        height: 464
                    },

                    {
                        x: 33,
                        y: 33,
                        width: 769,
                        height: 280
                    },

                    {
                        x: 320,
                        y: 301,
                        width: 476,
                        height: 19
                    },

                    {
                        x: 680,
                        y: 622,
                        width: 96,
                        height: 141
                    },
                    
                    {
                        x: 783,
                        y: 309,
                        width: 17,
                        height: 290
                    },

                    {
                        x: 680,
                        y: 622,
                        width: 96,
                        height: 141
                    },

                    {
                        x: 16,
                        y: 800,
                        width: 797,
                        height: 10
                    }
                ]
            }
        )
    }

    create() {
        super.create()

        // 🐱 Котёнок-учитель — выдаёт аквариум (шлем) за Feed and Grow
        this.addInteractionZone(
            350, 480, 80, 80,
            () => this.startFeedAndGrow(),
            'Поговорить с учителем'
        )

        // 👤 Визуальный NPC — учитель
        this.addNPC(
            350, 480,
            {
                name: 'Учитель',
                color: 0x4d9290
            }
        )

        // 🚪 Вход в детскую
        this.addLocationExit(
            750, 300,
            'В детскую',
            { color: 0x4d9290 }
        )

        // 🚪 Вход в гараж
        this.addLocationExit(
            50, 500,
            'В гараж',
            { color: 0xe88762 }
        )
    }

    private startFeedAndGrow() {
        const ui = this.getGameUI()

        const dialogue = ui.showDialogue(this, {
            speaker: 'Котёнок-учитель',
            text: 'Чтобы исследовать море, тебе нужен шлем! Покорми рыбок, чтобы они выросли — и получишь аквариум!'
        }, {
            onNext: () => {
                dialogue.close()
                this.launchFeedAndGrow()
            }
        })
    }

    private launchFeedAndGrow() {
        const ui = this.getGameUI()

        MiniGameFactory.create(this, MiniGameType.FEED_AND_GROW, {
            onComplete: () => {
                // Добавляем награду в инвентарь
                inventoryManager.addItem('aquarium')
                journalManager.completeChapter(1)

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

                ui.showToast(this, 'Аквариум получен!', journalManager.getGrandpaStory('aquarium'))
            },
            onFail: () => {
                // Можно переиграть
            }
        })
    }
}
