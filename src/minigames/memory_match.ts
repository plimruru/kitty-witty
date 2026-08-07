import Phaser from 'phaser'
import { UI_COLORS, uiTextStyle } from '../ui/theme'
import { UI_TEXTURES } from '../ui/ui_assets'
import { UIButton } from '../ui/button'
import { MiniGameOptions } from './mini_game_factory'
import { MiniGameBase } from './mini_game_base'

/**
 * Memory Match — найди пары рыбок.
 * Поле 4×3 (12 карточек), 6 пар. 20 ходов.
 */
export class MemoryMatch extends MiniGameBase {
    private readonly cards: Phaser.GameObjects.Container[] = []
    private flipped: Phaser.GameObjects.Container[] = []
    private matchedPairs = 0
    private moves = 0
    private readonly maxMoves = 20
    private isLocked = false
    private moveText!: Phaser.GameObjects.Text
    private readonly symbols = ['🐟', '🐠', '🐡', '🦈', '🐙', '🦑']

    constructor(scene: Phaser.Scene, options: MiniGameOptions) {
        super(scene, options)

        this.createBackground()
        this.createTitle('Найди пары рыбок', 'Открой две карточки за ход. Найди все 6 пар за 20 ходов!')
        this.createCloseButton()
        this.createMoveCounter()
        this.createGrid()
    }

    private createMoveCounter(): void {
        this.moveText = this.scene.add.text(
            960, 160,
            `Ходы: ${this.moves}/${this.maxMoves}`,
            uiTextStyle(26, UI_COLORS.sun, true)
        ).setOrigin(0.5)
        this.moveText.setScrollFactor(0)
        this.add(this.moveText)
    }

    private createGrid(): void {
        const cardWidth = 130
        const cardHeight = 160
        const gap = 20
        const startX = 960 - (cardWidth * 4 + gap * 3) / 2
        const startY = 220

        // Build deck: 2 of each symbol
        const deck: string[] = []
        for (let i = 0; i < 6; i++) {
            deck.push(this.symbols[i], this.symbols[i])
        }
        // Fisher-Yates shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[deck[i], deck[j]] = [deck[j], deck[i]]
        }

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const index = row * 4 + col
                const x = startX + col * (cardWidth + gap) + cardWidth / 2
                const y = startY + row * (cardHeight + gap) + cardHeight / 2

                const card = this.scene.add.container(x, y)
                const back = this.scene.add.rectangle(
                    0, 0, cardWidth, cardHeight,
                    UI_COLORS.coral
                ).setStrokeStyle(3, UI_COLORS.coralDark)
                const front = this.scene.add.rectangle(
                    0, 0, cardWidth, cardHeight,
                    UI_COLORS.paper
                ).setStrokeStyle(3, UI_COLORS.inkSoft)
                const symbol = this.scene.add.text(
                    0, 0,
                    deck[index],
                    uiTextStyle(52, UI_COLORS.ink, true)
                ).setOrigin(0.5)

                front.setVisible(false)
                symbol.setVisible(false)
                card.add([back, front, symbol])
                card.setSize(cardWidth, cardHeight)
                card.setInteractive({ useHandCursor: true })
                card.on('pointerdown', () => this.onCardClick(card))

                this.cards.push(card)
                this.add(card)
            }
        }
    }

    private onCardClick(card: Phaser.GameObjects.Container): void {
        if (this.isLocked || this.flipped.includes(card) || this.matchedPairs === 6) return
        if (this.flipped.length >= 2) return

        // Flip card face-up
        card.getAt(0).setVisible(false)  // back
        card.getAt(1).setVisible(true)   // front
        card.getAt(2).setVisible(true)   // symbol
        this.flipped.push(card)

        if (this.flipped.length === 2) {
            this.moves++
            this.moveText.setText(`Ходы: ${this.moves}/${this.maxMoves}`)
            this.isLocked = true

            const [card1, card2] = this.flipped
            const sym1 = (card1.getAt(2) as Phaser.GameObjects.Text).text
            const sym2 = (card2.getAt(2) as Phaser.GameObjects.Text).text

            if (sym1 === sym2) {
                // Match!
                this.matchedPairs++
                this.flipped = []
                this.isLocked = false

                // Mark matched cards
                card1.setAlpha(0.6)
                card2.setAlpha(0.6)

                if (this.matchedPairs === 6) {
                    this.win()
                }
            } else {
                // No match — flip back after delay
                this.scene.time.delayedCall(800, () => {
                    card1.getAt(0).setVisible(true)
                    card1.getAt(1).setVisible(false)
                    card1.getAt(2).setVisible(false)
                    card2.getAt(0).setVisible(true)
                    card2.getAt(1).setVisible(false)
                    card2.getAt(2).setVisible(false)
                    this.flipped = []
                    this.isLocked = false
                })
            }

            // Check for loss
            if (this.moves >= this.maxMoves && this.matchedPairs < 6) {
                this.lose()
            }
        }
    }

    private win(): void {
        this.isRunning = false
        this.isGameOver = true
        this.showResult('Победа!', UI_COLORS.success)
    }

    private lose(): void {
        this.isRunning = false
        this.isGameOver = true
        this.showResult('Поражение', UI_COLORS.coral, 'Повторить')
    }

    protected restart(): void {
        new MemoryMatch(this.scene, this.options)
    }
}
