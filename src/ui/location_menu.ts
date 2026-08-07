import Phaser from 'phaser'
import { UIModal } from './modal'
import { UI_COLORS, uiTextStyle } from './theme'

export const UI_MAP_TEXTURE_KEY = 'ui-city-map'

export function queueUiMap(scene: Phaser.Scene) {
    if (scene.textures.exists(UI_MAP_TEXTURE_KEY)) return
    const mapUrl = new URL('./assets/city-map.png', import.meta.url).href
    scene.load.image(UI_MAP_TEXTURE_KEY, mapUrl)
}

export interface MapLocationView {
    key: string
    name: string
    /** Координаты области в исходном изображении 464 × 507. */
    x: number
    y: number
    width: number
    height: number
    current?: boolean
    locked?: boolean
}

export interface LocationMenuOptions {
    locations: MapLocationView[]
    onSelect: (sceneKey: string) => void
    mapTextureKey?: string
}

export const DEFAULT_MAP_LOCATIONS: MapLocationView[] = [
    {
        key: 'children_room',
        name: 'Дом',
        x: 55,
        y: 48,
        width: 150,
        height: 155
    },
    {
        key: 'garage',
        name: 'Гараж',
        x: 275,
        y: 75,
        width: 155,
        height: 135
    },
    {
        key: 'classroom',
        name: 'Школа',
        x: 135,
        y: 205,
        width: 205,
        height: 145
    },
    {
        key: 'beach',
        name: 'Пляж',
        x: 145,
        y: 350,
        width: 210,
        height: 145
    },
    {
        key: 'sea',
        name: 'Море',
        x: 350,
        y: 380,
        width: 100,
        height: 120,
        locked: true
    }
]

export class LocationMenu extends UIModal {
    constructor(scene: Phaser.Scene, options: LocationMenuOptions) {
        super(scene, 'Карта', 'Нажмите на локацию для быстрого перехода')

        const textureKey = options.mapTextureKey ?? UI_MAP_TEXTURE_KEY
        if (!scene.textures.exists(textureKey)) {
            const warning = scene.add.text(
                625,
                500,
                'Карта не загружена.\nДобавьте queueUiMap(this) в preload сцены.',
                {
                    ...uiTextStyle(24, '#bd6047', true),
                    align: 'center'
                }
            ).setOrigin(0.5)
            this.content.add(warning)
            return
        }

        const sourceWidth = 464
        const sourceHeight = 507
        const displayHeight = 480
        const scale = displayHeight / sourceHeight
        const displayWidth = sourceWidth * scale
        const left = 960 - displayWidth / 2
        const top = 340
        const map = scene.add.image(
            960,
            top + displayHeight / 2,
            textureKey
        ).setDisplaySize(displayWidth, displayHeight)
        this.content.add(map)

        // Кликабельная область на всю карту
        // При клике в любом месте карты определяем ближайшую локацию
        const mapHit = scene.add.rectangle(
            left,
            top,
            displayWidth,
            displayHeight,
            0xffffff,
            0.001
        ).setOrigin(0).setInteractive({ useHandCursor: true })

        mapHit.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Определяем ближайшую доступную локацию
            let nearest: MapLocationView | null = null
            let minDist = Infinity

            for (const location of options.locations) {
                if (location.locked) continue

                const locCenterX = left + (location.x + location.width / 2) * scale
                const locCenterY = top + (location.y + location.height / 2) * scale

                const dist = Phaser.Math.Distance.Between(
                    pointer.x, pointer.y,
                    locCenterX, locCenterY
                )

                if (dist < minDist) {
                    minDist = dist
                    nearest = location
                }
            }

            if (nearest) {
                options.onSelect(nearest.key)
                this.close()
            }
        })

        // Показываем области локаций с подсветкой при наведении
        options.locations.forEach((location) => {
            const areaX = left + location.x * scale
            const areaY = top + location.y * scale
            const areaWidth = location.width * scale
            const areaHeight = location.height * scale
            const color = location.current
                ? UI_COLORS.coral
                : location.locked
                    ? UI_COLORS.inkSoft
                    : UI_COLORS.sun
            const area = scene.add.rectangle(
                areaX,
                areaY,
                areaWidth,
                areaHeight,
                color,
                location.current ? 0.2 : 0.001
            ).setOrigin(0)
                .setStrokeStyle(
                    location.current ? 5 : 0,
                    color,
                    location.current ? 0.9 : 0
                )
            const label = scene.add.text(
                areaX + areaWidth / 2,
                areaY + areaHeight / 2,
                location.locked ? 'ЗАКРЫТО' : location.name.toUpperCase(),
                {
                    ...uiTextStyle(17, '#fff7df', true),
                    backgroundColor: '#24343be6',
                    padding: { x: 9, y: 6 }
                }
            ).setOrigin(0.5).setVisible(false)

            // Подсветка при наведении на область
            area.setInteractive({ useHandCursor: !location.locked })
            area.on('pointerover', () => {
                area.setFillStyle(color, location.locked ? 0.16 : 0.28)
                label.setVisible(true)
            })
            area.on('pointerout', () => {
                area.setFillStyle(color, location.current ? 0.2 : 0.001)
                label.setVisible(false)
            })
            area.on('pointerdown', () => {
                if (location.locked) return
                options.onSelect(location.key)
                this.close()
            })

            this.content.add([area, label])
        })
    }
}
