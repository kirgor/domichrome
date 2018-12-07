const WIDTH = 16
const HEIGHT = 20

const WELL_COLOR = 0x101010
const CAMERA_LIGHT_INTENSITY = 3
const PIECE_LIGHT_INTENSITY = 1
const PIECE_LIGHT_DISTANCE = 10

const WELL_DEPTH = 3
const WELL_WALL_WIDTH = 1
const PIECE_DEPTH = 0.5
const FALLING_SPEED = 3
const FALLING_ACCELERATED_SPEED = 25

const INPUT_MOVES_PER_SECOND = 12

const ANIMATION_ROTATE_TIME = 0.1
const ANIMATION_MOVE_TIME = 0.1
const ANIMATION_SHAKE_TIME = 0.3
const ANIMATION_SHAKE_STEPS = 10
const ANIMATION_SHAKE_MAGNITUDE = 0.3

function game() {
    document.body.style.width = window.innerWidth + 'px'
    document.body.style.height = window.innerHeight + 'px'
    const scene = new Scene(document.body)

    const fallingPieceSceneObject = new FallingPieceSceneObject()
    const cameraLight = new SimpleSceneObject(new THREE.PointLight(0xffffff, CAMERA_LIGHT_INTENSITY))
    const blockSceneObjects = {}
    // const particleSystem = new ParticleSystemSceneObject()

    scene.add(cameraLight)
    // scene.add(particleSystem)

    const well = new Well({
        width: WIDTH,
        height: HEIGHT,
        onWellAppear({width, height}) {
            const wellSceneObject = new WellSceneObject(width, height)
            scene.add(wellSceneObject)

            const cameraPosition = new THREE.Vector3(
                wellSceneObject.getObject3D().position.x,
                wellSceneObject.getObject3D().position.y,
                20,
            )

            scene.getCamera().position.copy(cameraPosition)
            cameraLight.getObject3D().position.copy(cameraPosition)
        },
        onBlockAppear({x, y, color}) {
            const block = new BlockSceneObject(x, y, color)
            scene.add(block)
            blockSceneObjects[`${x}.${y}`] = block
        },
        onBlockDisappear({x, y}) {
            const key = `${x}.${y}`
            scene.remove(blockSceneObjects[key])
            delete blockSceneObjects[key]
        },
        onFallingPieceAppear({x, y, rotation, color1, color2}) {
            fallingPieceSceneObject.updatePosition(x, y)
            fallingPieceSceneObject.updateRotation(rotation)
            fallingPieceSceneObject.updateColors(color1, color2)
            scene.add(fallingPieceSceneObject)
        },
        onFallingPieceDisappear() {
            scene.remove(fallingPieceSceneObject)
        },
        onFallingPieceFall({x, y}) {
            fallingPieceSceneObject.updatePosition(x, y)
        },
        onFallingPieceMoveSuccess({x, y, right}) {
            fallingPieceSceneObject.updatePosition(x, y)
            fallingPieceSceneObject.playMoveAnimation(right)
        },
        onFallingPieceMoveRejected() {
            fallingPieceSceneObject.playShakeAnimation()
        },
        onFallingPieceRotateSuccess({rotation, clockwise}) {
            fallingPieceSceneObject.updateRotation(rotation)
            fallingPieceSceneObject.playRotateAnimation(clockwise, rotation)
        },
        onFallingPieceRotateRejected() {
            fallingPieceSceneObject.playShakeAnimation()
        },
    })

    well.startFallingPiece({
        speed: FALLING_SPEED,
    })

    setupControlInputs({
        well,
        initialSpeed: FALLING_SPEED,
        acceleratedSpeed: FALLING_ACCELERATED_SPEED,
        movesPerSecond: INPUT_MOVES_PER_SECOND,
    })

    scene.run((delta) => {
        well.advance(delta)
    })
}
