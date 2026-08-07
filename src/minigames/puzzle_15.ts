import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from '../ui/theme'
import { UI_TEXTURES } from '../ui/ui_assets'
import { UIButton } from '../ui/button'
import { MiniGameOptions } from './mini_game_factory'

/**
 * Игра в 15 — собери картинку, чтобы узнать пароль от шкафа.
 * После решения показывается подсказка с паролем «МОРЕ».
 */
export class Puzzle15 extends Phaser.GameObjects.Container {
    private readonly options: MiniGameOptions
    private readonly tiles: Phaser.GameObjects.Container[] = []
    private emptyIndex = 15
    private readonly tileSize = 100
    private readonly gap = 5
    private readonly gridOriginX = 960 - (4 * 100 + 3 * 5) / 2
    private readonly gridOriginY = 220
    private passwordInput: HTMLInputElement | null = null
    private passwordHintText: Phaser.GameObjects.Text | null = null
    private resultText: Phaser.GameObjects.Text | null = null
    private isSolved = false
    private submitBtn: UIButton | null = null

    constructor(scene: Phaser.Scene, options: MiniGameOptions) {
        super(scene, 0, 0)
        this.options = options
        this.setDepth(1000)
        scene.add.existing(this)

        this.createBackground()
        this.createTitle()
        this.createCloseButton()
        this.createGrid()

        // Clean up HTML input on destroy
        this.once(Phaser.GameObjects.Events.DESTROY, () => {
            this.cleanupInput()
        })
    }

    private createBackground(): void {
        const bg = this.scene.add.rectangle(
            0, 0, 1920, 1080,
            UI_COLORS.shadow, 0.85
        ).setOrigin(0).setInteractive({ useHandCursor: true })
        this.add(bg)
    }

    private createTitle(): void {
        const title = this.scene.add.text(
            960, 60,
            'Пятнашки',
            uiTextStyle(36, UI_COLORS.paper, true)
        ).setOrigin(0.5)
        this.add(title)

        const subtitle = this.scene.add.text(
            960, 110,
            'Собери плитки по порядку, чтобы узнать пароль от шкафа!',
            uiTextStyle(20, UI_COLORS.paper)
        ).setOrigin(0.5)
        this.add(subtitle)
    }

    private createCloseButton(): void {
        const closeBtn = this.scene.add.image(
            1850, 50,
            UI_TEXTURES.closeInactive
        ).setInteractive({ useHandCursor: true })
        closeBtn.on('pointerdown', () => this.close())
        closeBtn.on('pointerover', () => closeBtn.setTexture(UI_TEXTURES.closePressed))
        closeBtn.on('pointerout', () => closeBtn.setTexture(UI_TEXTURES.closeInactive))
        this.add(closeBtn)
    }

    private createGrid(): void {
        // Create solvable puzzle: start from solved state and make random moves
        const numbers: (number | null)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null]

        // Shuffle by making random valid moves
        let emptyPos = 15
        for (let step = 0; step < 100; step++) {
            const emptyRow = Math.floor(emptyPos / 4)
            const emptyCol = emptyPos % 4
            const neighbors: number[] = []
            if (emptyRow > 0) neighbors.push(emptyPos - 4)
            if (emptyRow < 3) neighbors.push(emptyPos + 4)
            if (emptyCol > 0) neighbors.push(emptyPos - 1)
            if (emptyCol < 3) neighbors.push(emptyPos + 1)
            const swapIndex = neighbors[Math.floor(Math.random() * neighbors.length)]
            ;[numbers[emptyPos], numbers[swapIndex]] = [numbers[swapIndex], numbers[emptyPos]]
            emptyPos = swapIndex
        }

        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / 4)
            const col = i % 4
            const x = this.gridOriginX + col * (this.tileSize + this.gap) + this.tileSize / 2
            const y = this.gridOriginY + row * (this.tileSize + this.gap) + this.tileSize / 2

            const value = numbers[i]
            if (value === null) {
                this.emptyIndex = i
                continue
            }

            const tile = this.scene.add.container(x, y)
            const bg = this.scene.add.rectangle(
                0, 0, this.tileSize, this.tileSize,
                UI_COLORS.coral
            ).setStrokeStyle(3, UI_COLORS.coralDark)
            const text = this.scene.add.text(
                0, 0,
                value.toString(),
                uiTextStyle(36, UI_COLORS.paper, true)
            ).setOrigin(0.5)
            tile.add([bg, text])
            tile.setSize(this.tileSize, this.tileSize)
            tile.setInteractive({ useHandCursor: true })
            tile.on('pointerdown', () => this.onTileClick(i))

            this.tiles[i] = tile
            this.add(tile)
        }
    }

    private onTileClick(index: number): void {
        if (this.isSolved) return

        const row = Math.floor(index / 4)
        const col = index % 4
        const emptyRow = Math.floor(this.emptyIndex / 4)
        const emptyCol = this.emptyIndex % 4

        const isAdjacent =
            (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow)
        if (!isAdjacent) return

        // Swap tile with empty position
        const tile = this.tiles[index]
        const emptyX = this.gridOriginX + emptyCol * (this.tileSize + this.gap) + this.tileSize / 2
        const emptyY = this.gridOriginY + emptyRow * (this.tileSize + this.gap) + this.tileSize / 2

        // Animate the move
        this.scene.tweens.add({
            targets: tile,
            x: emptyX,
            y: emptyY,
            duration: 150,
            ease: 'Power1'
        })

        this.tiles[index] = this.tiles[this.emptyIndex]
        this.tiles[this.emptyIndex] = tile
        this.emptyIndex = index

        this.checkWin()
    }

    private checkWin(): void {
        let solved = true
        for (let i = 0; i < 15; i++) {
            const tile = this.tiles[i]
            if (!tile) {
                solved = false
                break
            }
            const text = tile.getAt(1) as Phaser.GameObjects.Text
            if (parseInt(text.text) !== i + 1) {
                solved = false
                break
            }
        }
        if (solved) {
            this.isSolved = true
            this.showPasswordHint()
        }
    }

    private showPasswordHint(): void {
        this.passwordHintText = this.scene.add.text(
            960, 600,
            'Подсказка: пароль — МОРЕ',
            uiTextStyle(32, UI_COLORS.sun, true)
        ).setOrigin(0.5)
        this.add(this.passwordHintText)

        // Create HTML input for password
        this.passwordInput = document.createElement('input')
        this.passwordInput.type = 'text'
        this.passwordInput.placeholder = 'Введите пароль'
        this.passwordInput.style.position = 'fixed'
        this.passwordInput.style.left = '50%'
        this.passwordInput.style.top = '660px'
        this.passwordInput.style.transform = 'translateX(-50%)'
        this.passwordInput.style.fontSize = '24px'
        this.passwordInput.style.padding = '12px 20px'
        this.passwordInput.style.border = `3px solid #${UI_COLORS.ink.toString(16).padStart(6, '0')}`
        this.passwordInput.style.borderRadius = '6px'
        this.passwordInput.style.backgroundColor = '#fff7df'
        this.passwordInput.style.color = '#24343b'
        this.passwordInput.style.fontFamily = 'Galmuri7, monospace'
        this.passwordInput.style.zIndex = '1001'
        document.body.appendChild(this.passwordInput)
        this.passwordInput.focus()

        this.submitBtn = new UIButton(this.scene, 960, 740, {
            width: 220,
            height: 55,
            label: 'Проверить',
            fill: UI_COLORS.coral,
            onClick: () => {
                const value = this.passwordInput?.value.trim().toUpperCase()
                if (value === 'МОРЕ') {
                    this.win()
                } else {
                    this.showError()
                }
            }
        })
        this.add(this.submitBtn)
    }

    private showError(): void {
        if (this.resultText) this.resultText.destroy()
        this.resultText = this.scene.add.text(
            960, 810,
            'Неверный пароль! Попробуй ещё раз.',
            uiTextStyle(24, UI_COLORS.coral, true)
        ).setOrigin(0.5)
        this.add(this.resultText)
    }

    private win(): void {
        this.cleanupInput()
        this.showResult('Победа!', UI_COLORS.success)
        this.options.onComplete?.()
    }

    private showResult(message: string, color: number): void {
        this.resultText = this.scene.add.text(
            960, 700,
            message,
            uiTextStyle(48, color, true)
        ).setOrigin(0.5)
        this.add(this.resultText)

        const retryBtn = new UIButton(this.scene, 960, 800, {
            width: 220,
            height: 60,
            label: 'Попробовать снова',
            fill: UI_COLORS.coral,
            onClick: () => {
                this.destroy()
                new Puzzle15(this.scene, this.options)
            }
        })
        this.add(retryBtn)
    }

    private cleanupInput(): void {
        if (this.passwordInput) {
            this.passwordInput.remove()
            this.passwordInput = null
        }
        if (this.submitBtn) {
            this.submitBtn.destroy()
            this.submitBtn = null
        }
    }

    private close(): void {
        this.cleanupInput()
        this.destroy()
    }
}
