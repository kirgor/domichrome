function main() {
    document.body.style.width = window.innerWidth + 'px'
    document.body.style.height = window.innerHeight + 'px'
    const game = new Game(document.body)

    const fallingPiece = new FallingPiece()
    const cameraLight = new GameObject3D(new THREE.PointLight(0xffffff, CAMERA_LIGHT_INTENSITY))
    const blockSceneObjects = {}
    const particleSystem = new ParticleSystem()

    const wellMechanics = new WellMechanics({
        width: WIDTH,
        height: HEIGHT,
        onWellAppear({width, height}) {
            const wellSceneObject = new WellSceneObject(width, height)
            game.add(wellSceneObject)

            const cameraPosition = new THREE.Vector3(
                wellSceneObject.getObject3D().position.x,
                wellSceneObject.getObject3D().position.y,
                20,
            )

            game.getCamera().position.copy(cameraPosition)
            cameraLight.getObject3D().position.copy(cameraPosition)
        },
        onBlockAppear({x, y, color}) {
            const block = new Block(x, y, color)
            game.add(block)
            blockSceneObjects[`${x}.${y}`] = block
        },
        onBlockDisappear({x, y}) {
            const key = `${x}.${y}`
            game.remove(blockSceneObjects[key])
            delete blockSceneObjects[key]
        },
        onFallingPieceAppear({x, y, rotation, color1, color2}) {
            fallingPiece.updatePosition(x, y)
            fallingPiece.updateRotation(rotation)
            fallingPiece.updateColors(color1, color2)
            game.add(fallingPiece)
        },
        onFallingPieceDisappear() {
            game.remove(fallingPiece)
        },
        onFallingPieceFall({x, y}) {
            fallingPiece.updatePosition(x, y)
        },
        onFallingPieceMoveSuccess({x, y, right}) {
            fallingPiece.updatePosition(x, y)
            fallingPiece.playMoveAnimation(right)
        },
        onFallingPieceMoveRejected() {
            fallingPiece.playShakeAnimation()
        },
        onFallingPieceRotateSuccess({rotation, clockwise}) {
            fallingPiece.updateRotation(rotation)
            fallingPiece.playRotateAnimation(clockwise, rotation)
        },
        onFallingPieceRotateRejected() {
            fallingPiece.playShakeAnimation()
        },
    })

    wellMechanics.startFallingPiece({
        speed: FALLING_SPEED,
    })

    const input = new InputListener({
        wellMechanics,
        initialSpeed: FALLING_SPEED,
        acceleratedSpeed: FALLING_ACCELERATED_SPEED,
        delayBeforeAutoMove: INPUT_DELAY_BEFORE_AUTO_MOVE,
        autoMoveFrequency: INPUT_AUTO_MOVE_FREQUENCY,
    })

    game.add(input)
    game.add(cameraLight)
    game.add(wellMechanics)
    // scene.add(particleSystem)

    game.run()
}
