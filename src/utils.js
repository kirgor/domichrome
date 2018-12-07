function createSimpleAnimationAction(mixer, track, time, from, to) {
    const action = mixer.clipAction(new THREE.AnimationClip(null, time, [
        new THREE.NumberKeyframeTrack(track, [0, time], [from, to]),
    ]))
    action.clampWhenFinished = true
    action.repetitions = 1
    return action
}

function createShakeAnimationAction(mixer, time, steps, magnitude) {
    const times = []
    const values = []

    times.push(0)
    values.push(0, 0, 0)
    for (let i = 0; i < steps; i++) {
        times.push((i + 1) * time / (steps + 2))
        values.push(
            Math.random() * magnitude - magnitude / 2,
            Math.random() * magnitude - magnitude / 2,
            0,
        )
    }
    times.push(time)
    values.push(0, 0, 0)

    const action = mixer.clipAction(new THREE.AnimationClip(null, time, [
        new THREE.NumberKeyframeTrack('.position', times, values),
    ]))
    action.clampWhenFinished = true
    action.repetitions = 1
    return action
}

function pieceTotationToRads(rotation) {
    switch (rotation) {
        case PieceRotation.RIGHT:
            return 0
        case PieceRotation.DOWN:
            return Math.PI / 2
        case PieceRotation.LEFT:
            return Math.PI
        case PieceRotation.UP:
            return 3 * Math.PI / 2
    }
}

function blockColorToHex(color) {
    switch (color) {
        case BlockColor.RED:
            return 0xff0000
        case BlockColor.BLUE:
            return 0x0000ff
        case BlockColor.YELLOW:
            return 0xffff00
        default:
            return 0
    }
}
