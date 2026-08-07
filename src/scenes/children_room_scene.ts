import { BaseScene } from './base_scene'
import { MiniGameFactory, MiniGameType } from '../minigames'
import { inventoryManager } from '../managers/inventory_manager'
import { journalManager } from '../managers/journal_manager'
import { setGameUIState } from '../ui'
import { StealthManager } from '../utils/stealth_manager'

export class Children_room extends BaseScene {
    private stealth!: StealthManager
    private hideZoneActive = false

    constructor() {
        super(
            'children_room',
            {
                playerImage: {
                    key: 'player',
                    path: 'hero.png'
                },
                sceneImage: {
                    key: 'children_room',
                    path: 'children_room.png'
                },
                playerScale: 1,
                locationScale: 1.35,

                obstacles: [
                    {
                        x: 33,
                        y: 33,
                        width: 779,
                        height: 257
                    },

                    {
                        x: 63,
                        y: 191,
                        width: 254,
                        height: 129
                    },

                    {
                        x: 126,
                        y: 226,
                        width: 126,
                        height: 223
                    },

                    {
                        x: 20,
                        y: 480,
                        width: 76,
                        height: 257
                    },

                    {
                        x: 510,
                        y: 190,
                        width: 71,
                        height: 128
                    },

                    {
                        x: 147,
                        y: 746,
                        width: 89,
                        height: 44
                    },

                    {
                        x: 573,
                        y: 164,
                        width: 199,
                        height: 183
                    },

                    {
                        x: 678,
                        y: 385,
                        width: 121,
                        height: 417
                    },

                    {
                        x: 579,
                        y: 625,
                        width: 94,
                        height: 141
                    },

                    {
                        x: 610,
                        y: 415,
                        width: 70,
                        height: 129
                    },

                    {
                        x: 21,
                        y: 800,
                        width: 800,
                        height: 18
                    },

                    {
                        x: 16,
                        y: 268,
                        width: 16,
                        height: 541
                    }

                ]

            }
        )
    }

    create() {
        super.create()

        // 🔒 Шкаф (закрыт мамой) — выдаёт баллон за Memory Match + пароль
        this.addInteractionZone(
            630, 500, 100, 120,
            () => this.startWardrobePuzzle(),
            'Осмотреть шкаф'
        )

        // 👤 Визуальный NPC — мама (стоит у шкафа)
        this.addNPC(
            580, 400,
            {
                name: 'Мама',
                color: 0xdd85b6
            }
        )

        // 🚪 Вход в школу
        this.addLocationExit(
            750, 300,
            'В школу',
            { color: 0xf3c969 }
        )

        // 🚪 Вход в гараж
        this.addLocationExit(
            50, 500,
            'В гараж',
            { color: 0xe88762 }
        )

        // Скрытность: мама следит за Муром
        this.stealth = new StealthManager(this)
        this.stealth.start()

        // Зона укрытия (под кроватью)
        this.addInteractionZone(
            150, 600, 80, 80,
            () => {
                this.hideZoneActive = !this.hideZoneActive
                if (this.hideZoneActive) {
                    this.getGameUI().showToast(this, 'Ты в укрытии!', 'Мама не видит тебя здесь')
                }
            },
            'Спрятаться'
        )

        // Обновляем скрытность каждый кадр
        this.events.on(Phaser.Scenes.Events.UPDATE, () => {
            if (!this.stealth.isActive()) return
            if (this.hideZoneActive) {
                this.stealth.hide()
            } else {
                this.stealth.expose()
            }
        })

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.stealth.stop()
        })
    }

    private startWardrobePuzzle() {
        const ui = this.getGameUI()

        const dialogue = ui.showDialogue(this, {
            speaker: 'Мама',
            text: 'Не лезь в море! Я закрыла шкаф, чтобы ты не достал баллон. Если хочешь — найди все пары карточек и узнай пароль!'
        }, {
            onNext: () => {
                dialogue.close()
                this.launchMemoryMatch()
            }
        })
    }

    private launchMemoryMatch() {
        const ui = this.getGameUI()

        MiniGameFactory.create(this, MiniGameType.MEMORY_MATCH, {
            onComplete: () => {
                // После Memory Match показываем подсказку с паролем
                this.showPasswordHint()
            },
            onFail: () => {
                // Можно переиграть
            }
        })
    }

    private showPasswordHint() {
        const ui = this.getGameUI()

        const dialogue = ui.showDialogue(this, {
            speaker: 'Подсказка',
            text: 'Пароль от шкафа — МОРЕ. Введи его, чтобы открыть шкаф!'
        }, {
            onNext: () => {
                dialogue.close()
                this.showPasswordInput()
            }
        })
    }

    private showPasswordInput() {
        const ui = this.getGameUI()

        // Создаём HTML-инпут для ввода пароля
        const input = document.createElement('input')
        input.type = 'text'
        input.placeholder = 'Введите пароль'
        input.style.position = 'fixed'
        input.style.left = '50%'
        input.style.top = '50%'
        input.style.transform = 'translate(-50%, -50%)'
        input.style.fontSize = '24px'
        input.style.padding = '12px 20px'
        input.style.border = '3px solid #24343b'
        input.style.borderRadius = '6px'
        input.style.backgroundColor = '#fff7df'
        input.style.color = '#24343b'
        input.style.fontFamily = 'Galmuri7, monospace'
        input.style.zIndex = '1001'
        document.body.appendChild(input)
        input.focus()

        // Создаём кнопку проверки
        const submitBtn = document.createElement('button')
        submitBtn.textContent = 'Проверить'
        submitBtn.style.position = 'fixed'
        submitBtn.style.left = '50%'
        submitBtn.style.top = 'calc(50% + 60px)'
        submitBtn.style.transform = 'translateX(-50%)'
        submitBtn.style.fontSize = '20px'
        submitBtn.style.padding = '10px 30px'
        submitBtn.style.backgroundColor = '#e88762'
        submitBtn.style.color = '#fff'
        submitBtn.style.border = 'none'
        submitBtn.style.borderRadius = '6px'
        submitBtn.style.cursor = 'pointer'
        submitBtn.style.fontFamily = 'Galmuri7, monospace'
        submitBtn.style.zIndex = '1001'
        document.body.appendChild(submitBtn)

        const checkPassword = () => {
            const value = input.value.trim().toUpperCase()
            if (value === 'МОРЕ' || value === 'MORE') {
                // Правильный пароль — открываем шкаф
                input.remove()
                submitBtn.remove()
                this.unlockWardrobe()
            } else {
                input.style.border = '3px solid #e88762'
                input.value = ''
                input.placeholder = 'Неверный пароль!'
            }
        }

        submitBtn.addEventListener('click', checkPassword)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') checkPassword()
        })

        // Очистка при закрытии сцены
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            input.remove()
            submitBtn.remove()
        })
    }

    private unlockWardrobe() {
        const ui = this.getGameUI()

        inventoryManager.addItem('balloon')
        journalManager.completeChapter(3)

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

        ui.showToast(this, 'Баллон получен!', journalManager.getGrandpaStory('balloon'))
    }
}
