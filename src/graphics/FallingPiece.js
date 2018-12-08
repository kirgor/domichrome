class FallingPiece extends GameObject3D {
    constructor() {
        super()

        this.mesh1 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, PIECE_DEPTH),
            new THREE.MeshStandardMaterial({
                roughness: 0.1,
            }),
        )
        this.mesh1.position.x = 0
        this.mesh1.position.y = 0

        this.mesh2 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, PIECE_DEPTH),
            new THREE.MeshStandardMaterial({
                roughness: 0.1,
            }),
        )
        this.mesh2.position.x = 1
        this.mesh2.position.y = 0

        this.light1 = new THREE.PointLight(0, PIECE_LIGHT_INTENSITY, PIECE_LIGHT_DISTANCE)
        this.light1.position.copy(this.mesh1.position)
        this.light2 = new THREE.PointLight(0, PIECE_LIGHT_INTENSITY, PIECE_LIGHT_DISTANCE)
        this.light2.position.copy(this.mesh2.position)

        this.relativeGroup = new THREE.Group()
        this.relativeGroup.add(this.mesh1)
        this.relativeGroup.add(this.mesh2)
        this.relativeGroup.add(this.light1)
        this.relativeGroup.add(this.light2)

        this.outerGroup = new THREE.Group()
        this.outerGroup.add(this.relativeGroup)
        this.outerGroup.add(this.relativeGroup)

        this.mixer = new THREE.AnimationMixer(this.relativeGroup)

        this.moveLeftAA = createSimpleAnimationAction(this.mixer, '.position[x]', ANIMATION_MOVE_TIME, 1, 0)
        this.moveRightAA = createSimpleAnimationAction(this.mixer, '.position[x]', ANIMATION_MOVE_TIME, -1, 0)

        this.rotateAA = {
            clockwise: {
                [PieceRotation.DOWN]: createSimpleAnimationAction(this.mixer, '.rotation[z]', ANIMATION_ROTATE_TIME, 2 * Math.PI, 3 * Math.PI / 2),
                [PieceRotation.LEFT]: createSimpleAnimationAction(this.mixer, '.rotation[z]', ANIMATION_ROTATE_TIME, 3 * Math.PI / 2, Math.PI),
                [PieceRotation.UP]: createSimpleAnimationAction(this.mixer, '.rotation[z]', ANIMATION_ROTATE_TIME, Math.PI, Math.PI / 2),
                [PieceRotation.RIGHT]: createSimpleAnimationAction(this.mixer, '.rotation[z]', ANIMATION_ROTATE_TIME, Math.PI / 2, 0),
            },
            counterClockwise: {
                [PieceRotation.UP]: createSimpleAnimationAction(this.mixer, '.rotation[z]', ANIMATION_ROTATE_TIME, 0, Math.PI / 2),
                [PieceRotation.LEFT]: createSimpleAnimationAction(this.mixer, '.rotation[z]', ANIMATION_ROTATE_TIME, Math.PI / 2, Math.PI),
                [PieceRotation.DOWN]: createSimpleAnimationAction(this.mixer, '.rotation[z]', ANIMATION_ROTATE_TIME, Math.PI, 3 * Math.PI / 2),
                [PieceRotation.RIGHT]: createSimpleAnimationAction(this.mixer, '.rotation[z]', ANIMATION_ROTATE_TIME, 3 * Math.PI / 2, 2 * Math.PI),
            },
        }

        this.shakeAA = createShakeAnimationAction(this.mixer, ANIMATION_SHAKE_TIME, ANIMATION_SHAKE_STEPS, ANIMATION_SHAKE_MAGNITUDE)

        this.object3d = this.outerGroup
    }

    updatePosition(x, y) {
        this.outerGroup.position.x = x + 0.5
        this.outerGroup.position.y = -y - 0.5
        this.outerGroup.position.z = 0.5 * (PIECE_DEPTH + 1)
    }

    updateRotation(rotation) {
        this.relativeGroup.rotation.z = pieceTotationToRads(rotation)
    }

    updateColors(color1, color2) {
        this.mesh1.material.color.setHex(blockColorToHex(color1))
        this.mesh2.material.color.setHex(blockColorToHex(color2))
        this.light1.color.setHex(blockColorToHex(color1))
        this.light2.color.setHex(blockColorToHex(color2))
    }

    playMoveAnimation(right) {
        (right ? this.moveRightAA : this.moveLeftAA).reset().play()
    }

    playRotateAnimation(clockwise, rotation) {
        if (this._previousRotationAA) {
            this._previousRotationAA.reset().stop()
        }

        const aaByRotation = clockwise ? this.rotateAA.clockwise : this.rotateAA.counterClockwise
        const aa = aaByRotation[rotation]
        this._previousRotationAA = aa.reset().play()
    }

    playShakeAnimation() {
        this.mixer.stopAllAction()
        this.shakeAA.reset().play()
    }

    _beforeRender(delta) {
        this.mixer.update(delta)
    }
}
