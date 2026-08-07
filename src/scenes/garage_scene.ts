import { BaseScene } from './base_scene'
import { MiniGameFactory, MiniGameType } from '../minigames'
import { inventoryManager } from '../managers/inventory_manager'
import { journalManager } from '../managers/journal_manager'
import { setGameUIState } from '../ui'

export class Garage extends BaseScene {
    constructor() {
        super(
            'garage',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'garage',
                    path: 'garage.png'
                },
                playerScale: 1,
                locationScale: 1.35,
                obstacles: [
                    {
                        x: 21,
                        y: 21,
                        width: 525,
                        height: 329
                    },

                    {
                        x: 479,
                        y: 258,
                        width: 62,
                        height: 129
                    },

                    {
                        x: 544,
                        y: 20,
                        width: 268,
                        height: 265
                    },

                    {
                        x: 667,
                        y: 283,
                        width: 149,
                        height: 68
                    },

                    {
                        x: 704,
                        y: 339,
                        width: 109,
                        height: 76
                    },

                    {
                        x: 734,
                        y: 430,
                        width: 83,
                        height: 309
                    },

                    {
                        x: 23,
                        y: 797,
                        width: 796,
                        height: 30
                    },

                    {
                        x: 9,
                        y: 18,
                        width: 21,
                        height: 800
                    },

                    {
                        x: 247,
                        y: 472,
                        width: 280,
                        height: 204
                    },

                    {
                        x: 138,
                        y: 500,
                        width: 114,
                        height: 176
                    },
                ]
            }
        )
    }

    create() {
        super.create()

        // 🔧 Отец-инженер — собирает костюм за Spy Hunter
        this.addInteractionZone(
            300, 400, 100, 80,
            () => this.startSpyHunter(),
            'Поговорить с отцом'
        )

        // 👤 Визуальный NPC — отец-инженер
        this.addNPC(
            300, 400,
            {
                name: 'Отец',
                color: 0x4d9290
            }
        )

        // 🚪 Вход в детскую
        this.addLocationExit(
            750, 300,
            'В детскую',
            { color: 0xdd85b6 }
        )

        // 🚪 Вход в школу
        this.addLocationExit(
            50, 500,
            'В школу',
            { color: 0xf3c969 }
        )
    }

    private startSpyHunter() {
        const ui = this.getGameUI()

        const dialogue = ui.showDialogue(this, {
            speaker: 'Отец-инженер',
            text: 'Собери все детали вместе! Проведи подводный аппарат через препятствия — и я помогу тебе собрать костюм!'
        }, {
            onNext: () => {
                dialogue.close()
                this.launchSpyHunter()
            }
        })
    }

    private launchSpyHunter() {
        const ui = this.getGameUI()

        MiniGameFactory.create(this, MiniGameType.SPY_HUNTER, {
            onComplete: () => {
                // Собираем цельный костюм
                inventoryManager.forceAssembleSuit()
                journalManager.completeChapter(4)

                // Открываем локацию Sea
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

                ui.showToast(this, '🎉 КОСТЮМ СОБРАН!', journalManager.getGrandpaStory('suit'))
            },
            onFail: () => {
                // Можно переиграть
            }
        })
    }
}
