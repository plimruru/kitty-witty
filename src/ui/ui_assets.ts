import Phaser from 'phaser'

export const UI_TEXTURES = {
    menuInactive: 'ui-menu-inactive',
    menuPressed: 'ui-menu-pressed',
    closeInactive: 'ui-close-inactive',
    closePressed: 'ui-close-pressed',
    menuPanel: 'ui-menu-panel-3',
    menuItemInactive: 'ui-menu-item-inactive',
    menuItemPressed: 'ui-menu-item-pressed',
    modalBackground: 'ui-modal-background',
    inventoryWindow: 'ui-inventory-window',
    inventoryCell: 'ui-inventory-cell',
    locationLabel: 'ui-location-label',
    heroIcon: 'ui-hero-icon'
} as const

function assetUrl(fileName: string) {
    return new URL(
        `./assets/ui_parts_archive/${fileName}`,
        import.meta.url
    ).href
}

/**
 * Вызывать из preload каждой сцены, в которой используется UI.
 */
export function queueUiAssets(scene: Phaser.Scene) {
    const assets: Array<[string, string]> = [
        [UI_TEXTURES.menuInactive, 'menu_button_inactive.png'],
        [UI_TEXTURES.menuPressed, 'menu_button_pressed.png'],
        [UI_TEXTURES.closeInactive, 'close_button_inactive.png'],
        [UI_TEXTURES.closePressed, 'close_button_pressed.png'],
        [UI_TEXTURES.menuPanel, 'parameters_3.png'],
        [UI_TEXTURES.menuItemInactive, 'parameters_button_inactive.png'],
        [UI_TEXTURES.menuItemPressed, 'parameters_button_pressed.png'],
        [UI_TEXTURES.modalBackground, 'inventory_background.png'],
        [UI_TEXTURES.inventoryWindow, 'inventory_whole.png'],
        [UI_TEXTURES.inventoryCell, 'inventory_cell.png'],
        [UI_TEXTURES.locationLabel, 'location_name.png'],
        [UI_TEXTURES.heroIcon, '0.png']
    ]

    assets.forEach(([key, fileName]) => {
        if (!scene.textures.exists(key)) {
            scene.load.image(key, assetUrl(fileName))
        }
    })
}
