import Phaser from 'phaser'
import { CompactMenu, CompactMenuCallbacks } from './compact_menu'
import { CraftingUI, CraftingUIOptions } from './crafting_UI'
import { ChoiceMenu, ChoiceView } from './choice_menu'
import { DialogueBox, DialogueBoxOptions, DialogueLine } from './dialogue_box'
import { InventoryUI, InventoryUIOptions } from './inventory_UI'
import { LocationMenu, LocationMenuOptions } from './location_menu'
import { NotebookChapterView, NotebookUI } from './notebook_UI'
import { Toast } from './toast'

/**
 * UI не хранит прогресс и не меняет сцену самостоятельно.
 * На экране постоянно присутствует только компактная кнопка меню.
 */
export class GameUI {
    readonly menu: CompactMenu
    private activeOverlay?: Phaser.GameObjects.Container

    constructor(scene: Phaser.Scene, callbacks: CompactMenuCallbacks) {
        this.menu = new CompactMenu(scene, callbacks)
    }

    get isOverlayOpen() {
        return Boolean(this.activeOverlay?.active)
    }

    showDialogue(
        scene: Phaser.Scene,
        line: DialogueLine,
        options?: DialogueBoxOptions
    ) {
        return this.replaceOverlay(new DialogueBox(scene, line, options))
    }

    showInventory(scene: Phaser.Scene, options: InventoryUIOptions) {
        return this.replaceOverlay(new InventoryUI(scene, options))
    }

    showNotebook(scene: Phaser.Scene, chapters: NotebookChapterView[]) {
        return this.replaceOverlay(new NotebookUI(scene, chapters))
    }

    showCrafting(scene: Phaser.Scene, options: CraftingUIOptions) {
        return this.replaceOverlay(new CraftingUI(scene, options))
    }

    showLocations(scene: Phaser.Scene, options: LocationMenuOptions) {
        return this.replaceOverlay(new LocationMenu(scene, options))
    }

    showChoices(
        scene: Phaser.Scene,
        prompt: string,
        choices: ChoiceView[],
        onChoose: (choiceId: string) => void
    ) {
        return this.replaceOverlay(
            new ChoiceMenu(scene, prompt, choices, onChoose)
        )
    }

    showToast(scene: Phaser.Scene, title: string, message: string) {
        return new Toast(scene, title, message)
    }

    destroy() {
        this.activeOverlay?.destroy()
        this.menu.destroy()
    }

    private replaceOverlay<T extends Phaser.GameObjects.Container>(overlay: T): T {
        this.activeOverlay?.destroy()
        this.menu.close()
        this.activeOverlay = overlay
        overlay.once(Phaser.GameObjects.Events.DESTROY, () => {
            if (this.activeOverlay === overlay) this.activeOverlay = undefined
        })
        return overlay
    }
}
