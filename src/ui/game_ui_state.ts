import Phaser from 'phaser'
import { InventorySlotView } from './inventory_UI'
import { MapLocationView } from './location_menu'
import { NotebookChapterView } from './notebook_UI'

export interface GameUIState {
    inventory: InventorySlotView[]
    notebook: NotebookChapterView[]
    /** Если поле не задано, карта оставляет все локации доступными. */
    unlockedLocations?: string[]
}

export const GAME_UI_STATE_KEY = 'game-ui-state'

const EMPTY_GAME_UI_STATE: GameUIState = {
    inventory: [],
    notebook: []
}

/**
 * Общая точка чтения данных для UI. Состояние хранится в Phaser Registry,
 * поэтому не теряется при переходе между игровыми сценами.
 */
export function getGameUIState(scene: Phaser.Scene): GameUIState {
    return scene.registry.get(GAME_UI_STATE_KEY) ?? EMPTY_GAME_UI_STATE
}

/**
 * Вызывать из игровой механики после изменения инвентаря или прогресса.
 * UI получает только готовое представление данных и сам прогресс не меняет.
 */
export function setGameUIState(
    scene: Phaser.Scene,
    state: GameUIState
) {
    scene.registry.set(GAME_UI_STATE_KEY, state)
}

export function getMapLocationsForScene(
    sceneKey: string,
    locations: MapLocationView[],
    unlockedLocations?: string[]
): MapLocationView[] {
    return locations.map((location) => ({
        ...location,
        current: location.key === sceneKey,
        locked: unlockedLocations
            ? location.key !== sceneKey &&
                !unlockedLocations.includes(location.key)
            : location.locked
    }))
}
