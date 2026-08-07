import Phaser from 'phaser'

/**
 * Менеджер скрытности.
 * Мама следит за Муром в определённых локациях.
 * Если Мур слишком долго находится на виду — мама его замечает.
 */
export class StealthManager {
    private scene: Phaser.Scene
    private suspicion = 0
    private readonly maxSuspicion = 100
    private readonly suspicionRate = 10 // % в секунду
    private readonly decreaseRate = 5 // % в секунду
    private active = false
    private suspicionText: Phaser.GameObjects.Text | null = null
    private warningText: Phaser.GameObjects.Text | null = null
    private updateListener: (() => void) | null = null

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    /** Начинает слежку */
    start() {
        this.active = true
        this.suspicion = 0
        this.createUI()
        this.updateListener = () => this.update()
        this.scene.events.on('update', this.updateListener)
    }

    /** Останавливает слежку */
    stop() {
        this.active = false
        if (this.updateListener) {
            this.scene.events.off('update', this.updateListener)
            this.updateListener = null
        }
        this.destroyUI()
    }

    /** Игрок в укрытии — подозрение снижается */
    hide() {
        this.suspicion = Math.max(0, this.suspicion - this.decreaseRate * (1 / 60))
        this.updateUI()
    }

    /** Игрок на виду — подозрение растёт */
    expose() {
        this.suspicion = Math.min(this.maxSuspicion, this.suspicion + this.suspicionRate * (1 / 60))
        this.updateUI()

        if (this.suspicion >= this.maxSuspicion) {
            this.caught()
        }
    }

    /** Игрок пойман мамой */
    private caught() {
        this.active = false
        if (this.updateListener) {
            this.scene.events.off('update', this.updateListener)
            this.updateListener = null
        }

        // Показываем предупреждение
        if (this.warningText) {
            this.warningText.setText('Мама заметила тебя!')
            this.warningText.setColor('#e88762')
        }

        // Возвращаем Мура в безопасное место
        this.scene.cameras.main.shake(300, 0.01)

        // Сбрасываем подозрение
        this.suspicion = 0
        this.updateUI()

        // Через 3 секунды можно снова действовать
        this.scene.time.delayedCall(3000, () => {
            this.active = true
            if (this.warningText) {
                this.warningText.setText('')
            }
        })
    }

    private createUI() {
        this.suspicionText = this.scene.add.text(
            960,
            100,
            'Подозрение: 0%',
            {
                fontFamily: '"Galmuri7", "Courier New", monospace',
                fontSize: '22px',
                color: '#f3c969'
            }
        ).setOrigin(0.5).setDepth(900)

        this.warningText = this.scene.add.text(
            960,
            140,
            '',
            {
                fontFamily: '"Galmuri7", "Courier New", monospace',
                fontSize: '18px',
                color: '#e88762'
            }
        ).setOrigin(0.5).setDepth(900)
    }

    private destroyUI() {
        this.suspicionText?.destroy()
        this.suspicionText = null
        this.warningText?.destroy()
        this.warningText = null
    }

    private updateUI() {
        if (this.suspicionText) {
            this.suspicionText.setText(`Подозрение: ${Math.round(this.suspicion)}%`)
            const color = this.suspicion > 70 ? '#e88762' : '#f3c969'
            this.suspicionText.setColor(color)
        }
    }

    private update() {
        if (!this.active) return
        // Если игрок не двигается — подозрение снижается
        // Если двигается — растёт (упрощённо)
        this.updateUI()
    }

    /** Проверяет, активна ли слежка */
    isActive(): boolean {
        return this.active
    }
}
