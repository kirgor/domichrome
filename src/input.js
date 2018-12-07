function setupControlInputs(well) {
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowLeft':
                well.move(false)
                break
            case 'ArrowRight':
                well.move(true)
                break
            case 'q':
                well.rotate(false)
                break
            case 'w':
                well.rotate(true)
                break
        }
    })
}
