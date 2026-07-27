import Phaser from 'phaser'

export function createSceneMenu(
    scene: Phaser.Scene
) {
    const scenes = [
        {
            name: 'Classroom',
            key: 'classroom'
        },
        {
            name: 'Beach',
            key: 'beach'
        },
        {
            name: 'Children room',
            key: 'children_room'
        },
        {
            name: 'Garage',
            key: 'garage'
        },
        {
            name: 'Sea',
            key: 'sea'
        }
    ]

    const menuWidth = 240
    const menuX = scene.scale.width - 20

    const menuContainer =
        scene.add.container(
            menuX,
            20
        )

    menuContainer
        .setDepth(100)
        .setScrollFactor(0)

    const buttonBackground =
        scene.add.rectangle(
            0,
            0,
            54,
            48,
            0x111827
        )

    buttonBackground
        .setOrigin(1, 0)
        .setStrokeStyle(
            2,
            0x475569
        )
        .setInteractive({
            useHandCursor: true
        })

    const menuIcon =
        scene.add.text(
            -27,
            7,
            '☰',
            {
                fontSize: '28px',
                color: '#ffffff'
            }
        )

    menuIcon.setOrigin(
        0.5,
        0
    )

    const panel =
        scene.add.container(
            0,
            58
        )

    const panelBackground =
        scene.add.rectangle(
            0,
            0,
            menuWidth,
            scenes.length * 48 + 75,
            0x0f172a,
            0.98
        )

    panelBackground
        .setOrigin(1, 0)
        .setStrokeStyle(
            2,
            0x475569
        )

    const title =
        scene.add.text(
            -20,
            18,
            'LOCATIONS',
            {
                fontSize: '15px',
                color: '#94a3b8',
                fontStyle: 'bold'
            }
        )

    title.setOrigin(
        1,
        0
    )

    panel.add([
        panelBackground,
        title
    ])

    const backgrounds:
        Phaser.GameObjects.Rectangle[] = []

    scenes.forEach(
        (sceneData, index) => {
            const y =
                55 + index * 48

            const background =
                scene.add.rectangle(
                    -20,
                    y,
                    menuWidth - 20,
                    40,
                    0x1e293b
                )

            background
                .setOrigin(1, 0)
                .setInteractive({
                    useHandCursor: true
                })

            const item =
                scene.add.text(
                    -40,
                    y + 9,
                    sceneData.name,
                    {
                        fontSize: '17px',
                        color: '#e2e8f0'
                    }
                )

            item.setOrigin(
                1,
                0
            )

            background.on(
                'pointerover',
                () => {
                    background.setFillStyle(
                        0x334155
                    )

                    item.setColor(
                        '#38bdf8'
                    )
                }
            )

            background.on(
                'pointerout',
                () => {
                    background.setFillStyle(
                        0x1e293b
                    )

                    item.setColor(
                        '#e2e8f0'
                    )
                }
            )

            background.on(
                'pointerdown',
                () => {
                    scene.scene.start(
                        sceneData.key
                    )
                }
            )

            panel.add([
                background,
                item
            ])

            backgrounds.push(
                background
            )
        }
    )

    menuContainer.add([
        buttonBackground,
        menuIcon,
        panel
    ])

    let menuVisible = true

    panel.setAlpha(
        1
    )

    buttonBackground.on(
        'pointerdown',
        () => {
            menuVisible = !menuVisible

            if (menuVisible) {
                panel.setVisible(
                    true
                )

                scene.tweens.add({
                    targets: panel,
                    alpha: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Power2'
                })

                menuIcon.setText(
                    '✕'
                )
            } else {
                scene.tweens.add({
                    targets: panel,
                    alpha: 0,
                    scaleY: 0,
                    duration: 200,
                    ease: 'Power2',
                    onComplete: () => {
                        panel.setVisible(
                            false
                        )
                    }
                })

                menuIcon.setText(
                    '☰'
                )
            }
        }
    )
}