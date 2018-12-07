function setupControlInputs({
    well,
    initialSpeed,
    acceleratedSpeed,
    movesPerSecond,
}) {
    const delayBetweenMoves = 1000 / movesPerSecond

    let moveLeftPressed = false
    let moveRightPressed = false
    let moveDownPressed = false
    let rotatePressed = false

    let lastMovePressTime = 0

    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowLeft':
                if (!moveLeftPressed && !moveRightPressed) {
                    moveLeftPressed = true
                    lastMovePressTime = performance.now()
                    well.move(false)
                }
                e.preventDefault()
                break
            case 'ArrowRight':
                if (!moveRightPressed && !moveLeftPressed) {
                    moveRightPressed = true
                    lastMovePressTime = performance.now()
                    well.move(true)
                }
                e.preventDefault()
                break
            case 'ArrowDown':
                if (!moveDownPressed) {
                    moveDownPressed = true
                    well.setSpeed(acceleratedSpeed)
                }
                e.preventDefault()
                break
            case 'ArrowUp':
                if (!rotatePressed) {
                    rotatePressed = true
                    well.rotate(false)
                }
                e.preventDefault()
                break
            case 'w':
                if (!rotatePressed) {
                    rotatePressed = true
                    well.rotate(true)
                }
                e.preventDefault()
                break
        }
    })

    document.addEventListener('keyup', e => {
        switch (e.key) {
            case 'ArrowLeft':
                moveLeftPressed = false
                e.preventDefault()
                break
            case 'ArrowRight':
                moveRightPressed = false
                e.preventDefault()
                break
            case 'ArrowDown':
                moveDownPressed = false
                well.setSpeed(initialSpeed)
                e.preventDefault()
                break
            case 'ArrowUp':
                rotatePressed = false
                e.preventDefault()
                break
            case 'w':
                rotatePressed = false
                e.preventDefault()
                break
        }
    })

    rafLoop(() => {
        const time = performance.now()

        if (moveLeftPressed || moveRightPressed) {
            let moves = 0
            let i = lastMovePressTime + delayBetweenMoves
            while (i < time) {
                moves++
                i += delayBetweenMoves
            }
            lastMovePressTime = i - delayBetweenMoves

            let canMoveMore = true
            for (let j = 0; j < moves && canMoveMore; j++) {
                canMoveMore = well.move(moveRightPressed)
            }
        }
    })
}
