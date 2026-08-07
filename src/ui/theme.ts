import Phaser from 'phaser'

export const UI_SIZE = {
    width: 1920,
    height: 1080
} as const

export const UI_COLORS = {
    ink: 0x24343b,
    inkSoft: 0x52666b,
    paper: 0xfff7df,
    paperDark: 0xeadfbe,
    sea: 0x4d9290,
    seaDark: 0x2f6f73,
    coral: 0xe88762,
    coralDark: 0xbd6047,
    sun: 0xf3c969,
    success: 0x75a66f,
    white: 0xffffff,
    shadow: 0x17262c
} as const

// ИЗМЕНЕНО: новое имя шрифта
export const UI_FONT = '"Galmuri7", "Courier New", monospace'

let fontLoadPromise: Promise<void> | undefined

/**
 * Загружает локальный шрифт Galmuri7 (Rus by rigbikkk).
 * В BootScene следует дождаться этого Promise до создания текстов Phaser.
 */
export function loadPixelFont(): Promise<void> {
    if (fontLoadPromise) return fontLoadPromise

    // ИЗМЕНЕНО: новый путь к файлу
    const fontUrl = new URL(
        './assets/fonts/Galmuri7 (Rus by rigbikkk).ttf',
        import.meta.url
    ).href
    
    // ИЗМЕНЕНО: экранирование кавычек и пробелов в имени
    const font = new FontFace(
        'Galmuri7',
        `url("${fontUrl}") format('truetype')`,
        {
            style: 'normal',
            weight: '400'
        }
    )

    fontLoadPromise = font.load().then((loadedFont) => {
        document.fonts.add(loadedFont)
        return document.fonts.ready.then(() => undefined)
    }).catch((error) => {
        console.error('Ошибка загрузки шрифта Galmuri7:', error)
        throw error
    })

    return fontLoadPromise
}

export function uiTextStyle(
    size: number,
    color = '#24343b',
    bold = false
): Phaser.Types.GameObjects.Text.TextStyle {
    return {
        fontFamily: UI_FONT,
        fontSize: `${size}px`,
        color,
        fontStyle: bold ? 'bold' : 'normal'
    }
}
