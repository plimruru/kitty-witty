import Phaser from 'phaser'
import { MiniGameType } from './mini_game_types'
import { MemoryMatch } from './memory_match'
import { ShellHunt } from './shell_hunt'
import { Puzzle15 } from './puzzle_15'
import { FixGadget } from './fix_gadget'
import { FeedAndGrow } from './feed_and_grow'
import { Arkanoid } from './arkanoid'
import { SpyHunter } from './spy_hunter'
import { Labyrinth } from './labyrinth'

export interface MiniGameOptions {
    onComplete?: () => void
    onFail?: () => void
}

/** Ключ для хранения флага активной мини-игры в данных сцены. */
export const MINI_GAME_ACTIVE_KEY = 'mini-game-active'

/**
 * Фабрика мини-игр.
 * Создаёт конкретную мини-игру поверх текущей сцены.
 * Мини-игра сама управляет своим жизненным циклом и вызывает
 * onComplete / onFail после завершения.
 */
export class MiniGameFactory {
    static create(
        scene: Phaser.Scene,
        type: MiniGameType,
        options: MiniGameOptions = {}
    ): Phaser.GameObjects.Container {
        // Помечаем сцену, что мини-игра активна (блокирует движение игрока)
        scene.data.set(MINI_GAME_ACTIVE_KEY, true)

        let game: Phaser.GameObjects.Container
        switch (type) {
            case MiniGameType.FEED_AND_GROW:
                game = new FeedAndGrow(scene, options)
                break
            case MiniGameType.ARKANOID:
            case MiniGameType.SHELL_HUNT:
                game = new Arkanoid(scene, options)
                break
            case MiniGameType.MEMORY_MATCH:
                game = new MemoryMatch(scene, options)
                break
            case MiniGameType.SPY_HUNTER:
                game = new SpyHunter(scene, options)
                break
            case MiniGameType.LABYRINTH:
                game = new Labyrinth(scene, options)
                break
            case MiniGameType.PUZZLE_15:
                game = new Puzzle15(scene, options)
                break
            case MiniGameType.FIX_GADGET:
                game = new FixGadget(scene, options)
                break
            default:
                scene.data.set(MINI_GAME_ACTIVE_KEY, false)
                throw new Error(`Unknown mini-game type: ${type}`)
        }

        // Сбрасываем флаг при уничтожении мини-игры
        game.once(Phaser.GameObjects.Events.DESTROY, () => {
            scene.data.set(MINI_GAME_ACTIVE_KEY, false)
        })

        return game
    }
}
