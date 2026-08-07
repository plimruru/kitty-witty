import Phaser from 'phaser'

/**
 * Программно генерирует canvas-текстуры для персонажей и предметов.
 * Использует стиль Goose Goose Duck: крупные персонажи простых форм,
 * толстые чёрные контуры, яркая пастельная палитра.
 */

export function generateCatTexture(
    scene: Phaser.Scene,
    key: string,
    color = '#f5a623',
    size = 128
): void {
    if (scene.textures.exists(key)) return

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Body (oval)
    ctx.fillStyle = color
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.ellipse(size / 2, size * 0.65, size * 0.35, size * 0.25, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Head (big circle)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(size / 2, size * 0.35, size * 0.28, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Ears (triangles)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(size * 0.3, size * 0.2)
    ctx.lineTo(size * 0.22, size * 0.02)
    ctx.lineTo(size * 0.45, size * 0.12)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(size * 0.7, size * 0.2)
    ctx.lineTo(size * 0.78, size * 0.02)
    ctx.lineTo(size * 0.55, size * 0.12)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Eyes
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(size * 0.42, size * 0.32, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(size * 0.58, size * 0.32, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(size * 0.44, size * 0.32, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(size * 0.60, size * 0.32, 4, 0, Math.PI * 2)
    ctx.fill()

    // Nose
    ctx.fillStyle = '#e88762'
    ctx.beginPath()
    ctx.arc(size * 0.5, size * 0.42, 4, 0, Math.PI * 2)
    ctx.fill()

    // Whiskers
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(size * 0.35, size * 0.42)
    ctx.lineTo(size * 0.2, size * 0.38)
    ctx.moveTo(size * 0.35, size * 0.46)
    ctx.lineTo(size * 0.2, size * 0.46)
    ctx.moveTo(size * 0.65, size * 0.42)
    ctx.lineTo(size * 0.8, size * 0.38)
    ctx.moveTo(size * 0.65, size * 0.46)
    ctx.lineTo(size * 0.8, size * 0.46)
    ctx.stroke()

    scene.textures.addCanvas(key, canvas)
}

export function generateTeacherTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists('teacher')) return

    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    // Body
    ctx.fillStyle = '#4d9290'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.ellipse(64, 85, 35, 25, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Head
    ctx.fillStyle = '#f5a623'
    ctx.beginPath()
    ctx.arc(64, 45, 28, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Glasses
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(54, 42, 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(74, 42, 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(66, 42)
    ctx.lineTo(62, 42)
    ctx.stroke()

    // Pointer (указка)
    ctx.strokeStyle = '#e88762'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(85, 60)
    ctx.lineTo(110, 30)
    ctx.stroke()

    scene.textures.addCanvas('teacher', canvas)
}

export function generateSellerTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists('seller')) return

    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    // Body
    ctx.fillStyle = '#e88762'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.ellipse(64, 85, 35, 25, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Head
    ctx.fillStyle = '#f5a623'
    ctx.beginPath()
    ctx.arc(64, 45, 28, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Panama hat
    ctx.fillStyle = '#fff7df'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(64, 28, 32, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(64, 28, 14, Math.PI, 0)
    ctx.fill()
    ctx.stroke()

    // Shell tray
    ctx.fillStyle = '#96ceb4'
    ctx.beginPath()
    ctx.ellipse(64, 95, 30, 12, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    scene.textures.addCanvas('seller', canvas)
}

export function generateFatherTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists('father')) return

    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')!

    // Body (overalls)
    ctx.fillStyle = '#4d9290'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.ellipse(64, 85, 35, 25, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Head
    ctx.fillStyle = '#f5a623'
    ctx.beginPath()
    ctx.arc(64, 45, 28, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Wrench (гаечный ключ)
    ctx.strokeStyle = '#8b5755'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(90, 60)
    ctx.lineTo(115, 35)
    ctx.stroke()

    scene.textures.addCanvas('father', canvas)
}

/** Генерирует текстуру предмета на canvas */
function generateItemTexture(
    scene: Phaser.Scene,
    key: string,
    drawFn: (ctx: CanvasRenderingContext2D) => void
): void {
    if (scene.textures.exists(key)) return

    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    drawFn(ctx)

    scene.textures.addCanvas(key, canvas)
}

export function generateItemTextures(scene: Phaser.Scene): void {
    // Аквариум (шлем)
    generateItemTexture(scene, 'aquarium', (ctx) => {
        ctx.fillStyle = '#4d9290'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(32, 32, 24, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Fish inside
        ctx.fillStyle = '#f5a623'
        ctx.beginPath()
        ctx.ellipse(32, 32, 10, 6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
    })

    // Ласты
    generateItemTexture(scene, 'flippers', (ctx) => {
        ctx.fillStyle = '#e88762'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(10, 20)
        ctx.lineTo(30, 10)
        ctx.lineTo(50, 30)
        ctx.lineTo(40, 50)
        ctx.lineTo(20, 40)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    })

    // Баллон
    generateItemTexture(scene, 'balloon', (ctx) => {
        ctx.fillStyle = '#96ceb4'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.ellipse(32, 32, 20, 28, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Valve
        ctx.fillStyle = '#e88762'
        ctx.fillRect(27, 8, 10, 8)
        ctx.strokeRect(27, 8, 10, 8)
    })

    // Перчатки
    generateItemTexture(scene, 'gloves', (ctx) => {
        ctx.fillStyle = '#f3c969'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        // Left glove
        ctx.beginPath()
        ctx.ellipse(22, 40, 12, 18, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        // Right glove
        ctx.beginPath()
        ctx.ellipse(42, 40, 12, 18, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
    })

    // Костюм
    generateItemTexture(scene, 'suit', (ctx) => {
        ctx.fillStyle = '#4d9290'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.ellipse(32, 40, 22, 28, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Helmet
        ctx.fillStyle = '#96ceb4'
        ctx.beginPath()
        ctx.arc(32, 16, 12, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
    })

    // Шланг (hose)
    generateItemTexture(scene, 'hose', (ctx) => {
        ctx.strokeStyle = '#4d9290'
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(10, 50)
        ctx.quadraticCurveTo(20, 10, 50, 20)
        ctx.quadraticCurveTo(55, 35, 45, 45)
        ctx.stroke()

        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(10, 50)
        ctx.quadraticCurveTo(20, 10, 50, 20)
        ctx.quadraticCurveTo(55, 35, 45, 45)
        ctx.stroke()
    })

    // Линейка (ruler)
    generateItemTexture(scene, 'ruler', (ctx) => {
        ctx.fillStyle = '#f3c969'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.fillRect(8, 20, 48, 24)
        ctx.strokeRect(8, 20, 48, 24)

        // Marks
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        for (let i = 0; i < 5; i++) {
            const x = 12 + i * 10
            ctx.beginPath()
            ctx.moveTo(x, 20)
            ctx.lineTo(x, 26)
            ctx.stroke()
        }
    })

    // Гайки (nuts)
    generateItemTexture(scene, 'nuts', (ctx) => {
        ctx.fillStyle = '#8b5755'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(32, 32, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Hex shape
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2
            const x = 32 + Math.cos(angle) * 14
            const y = 32 + Math.sin(angle) * 14
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = '#a07060'
        ctx.fill()
        ctx.stroke()
    })

    // Очки (glasses)
    generateItemTexture(scene, 'glasses', (ctx) => {
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(22, 32, 14, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(42, 32, 14, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(36, 32)
        ctx.lineTo(28, 32)
        ctx.stroke()
    })

    // Пакет (bag)
    generateItemTexture(scene, 'bag', (ctx) => {
        ctx.fillStyle = '#e88762'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(15, 25)
        ctx.lineTo(49, 25)
        ctx.lineTo(45, 50)
        ctx.lineTo(19, 50)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Handle
        ctx.beginPath()
        ctx.arc(32, 20, 8, Math.PI, 0)
        ctx.stroke()
    })

    // Ракушки (shells)
    generateItemTexture(scene, 'shells', (ctx) => {
        ctx.fillStyle = '#96ceb4'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(32, 32, 20, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Shell lines
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1
        for (let i = 0; i < 4; i++) {
            ctx.beginPath()
            ctx.arc(32, 32, 5 + i * 4, 0, Math.PI * 2)
            ctx.stroke()
        }
    })
}

export function generateAllTextures(scene: Phaser.Scene): void {
    generateCatTexture(scene, 'player')
    generateTeacherTexture(scene)
    generateSellerTexture(scene)
    generateFatherTexture(scene)
    generateItemTextures(scene)
}
