class InputListener extends GameChild {
    constructor({
        wellMechanics,
        initialSpeed,
        acceleratedSpeed,
        delayBeforeAutoMove,
        autoMoveFrequency,
        moveLeftBinding = 'ArrowLeft',
        moveRightBinding = 'ArrowRight',
        rotateClockwiseBinding = 'q',
        rotateCounterClockwiseBinding = 'ArrowUp',
        accelerateBinding: moveDownBinding = 'ArrowDown',
    }) {
        super()

        this.wellMechanics = wellMechanics
        this.delayBeforeAutoMove = delayBeforeAutoMove
        this.autoMoveFrequency = autoMoveFrequency

        this.moveLeftPressed = false
        this.moveRightPressed = false
        this.moveDownPressed = false
        this.rotatePressed = false
        this.lastMovePressTime = 0
        this.autoMoveActivated = false

        document.addEventListener('keydown', e => {
            if (!this.elapsed) {
                return
            }

            switch (e.key) {
                case moveLeftBinding:
                    if (!this.moveLeftPressed) {
                        this.moveLeftPressed = true
                        if (!this.autoMoveActivated) {
                            this.lastMovePressTime = this.elapsed
                            wellMechanics.move(false)
                        }
                    }
                    e.preventDefault()
                    break
                case moveRightBinding:
                    if (!this.moveRightPressed) {
                        this.moveRightPressed = true
                        if (!this.autoMoveActivated) {
                            this.lastMovePressTime = this.elapsed
                            wellMechanics.move(true)
                        }
                    }
                    e.preventDefault()
                    break
                case moveDownBinding:
                    if (!this.moveDownPressed) {
                        this.moveDownPressed = true
                        wellMechanics.setSpeed(acceleratedSpeed)
                    }
                    e.preventDefault()
                    break
                case rotateCounterClockwiseBinding:
                    if (!this.rotatePressed) {
                        this.rotatePressed = true
                        wellMechanics.rotate(false)
                    }
                    e.preventDefault()
                    break
                case rotateClockwiseBinding:
                    if (!this.rotatePressed) {
                        this.rotatePressed = true
                        wellMechanics.rotate(true)
                    }
                    e.preventDefault()
                    break
            }
        })

        document.addEventListener('keyup', e => {
            switch (e.key) {
                case moveLeftBinding:
                    this.moveLeftPressed = false
                    e.preventDefault()
                    break
                case moveRightBinding:
                    this.moveRightPressed = false
                    e.preventDefault()
                    break
                case moveDownBinding:
                    this.moveDownPressed = false
                    wellMechanics.setSpeed(initialSpeed)
                    e.preventDefault()
                    break
                case rotateCounterClockwiseBinding:
                    this.rotatePressed = false
                    e.preventDefault()
                    break
                case rotateClockwiseBinding:
                    this.rotatePressed = false
                    e.preventDefault()
                    break
            }
        })
    }

    _beforeRender(delta, elapsed) {
        this.elapsed = elapsed

        if (this.moveLeftPressed || this.moveRightPressed) {
            const autoMoveDelay = 1 / this.autoMoveFrequency
            let delay = this.autoMoveActivated ? autoMoveDelay : this.delayBeforeAutoMove
            let moves = 0

            let i = this.lastMovePressTime + delay
            while (i < elapsed) {
                this.autoMoveActivated = true
                delay = autoMoveDelay
                i += delay
                moves++
            }
            this.lastMovePressTime = i - delay

            let canMoveMore = true
            for (let j = 0; j < moves && canMoveMore; j++) {
                canMoveMore = this.wellMechanics.move(this.moveRightPressed)
            }
        } else {
            this.autoMoveActivated = false
        }
    }
}
