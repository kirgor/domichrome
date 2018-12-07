class Well {
    constructor({
        width = 10,
        height = 50,
        onWellAppear,
        onBlockAppear,
        onBlockDisappear,
        onFallingPieceAppear,
        onFallingPieceDisappear,
        onFallingPieceFall,
        onFallingPieceMoveSuccess,
        onFallingPieceMoveRejected,
        onFallingPieceRotateSuccess,
        onFallingPieceRotateRejected,
    }) {
        this._width = width
        this._height = height
        this._callbacks = {
            onWellAppear,
            onBlockAppear,
            onBlockDisappear,
            onFallingPieceAppear,
            onFallingPieceDisappear,
            onFallingPieceFall,
            onFallingPieceMoveSuccess,
            onFallingPieceMoveRejected,
            onFallingPieceRotateSuccess,
            onFallingPieceRotateRejected,
        }

        this._fallingPiece = null
        this._blocks = []
        for (let i = 0; i < width * height; i++) {
            this._blocks.push(null)
        }
    }

    getWidth() {
        return this._width
    }

    getHeight() {
        return this._height
    }

    getBlock(x, y) {
        // Blocks to the side or below are filled with BOUNDARY
        if (x < 0 || x >= this._width || y >= this._height) {
            return BlockColor.BOUNDARY
        }

        // Blocks above well are always empty
        if (y < 0) {
            return null
        }

        return this._blocks[y * this._width + x]
    }

    setBlock(x, y, color = null) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return
        }

        const oldBlock = this.getBlock(x, y)
        if (oldBlock) {
            this._callbacks.onBlockDisappear({x, y, color: oldBlock})
        }

        this._blocks[y * this._width + x] = color
        if (color) {
            this._callbacks.onBlockAppear({x, y, color})
        }
    }

    startFallingPiece({
        x = Math.floor(this._width / 2) - 1,
        y = 0,
        color1 = Math.floor(Math.random() * 3) + 1,
        color2 = Math.floor(Math.random() * 3) + 1,
        speed = 0,
    }) {
        if (this._fallingPiece) {
            this._callbacks.onFallingPieceDisappear()
        }

        if (this.getBlock(x, y) || this.getBlock(x + 1, y)) {
            this.clear()
        }

        this._fallingPiece = {x, y, color1, color2, rotation: PieceRotation.RIGHT, speed}
        this._callbacks.onFallingPieceAppear({...this._fallingPiece})
    }

    clear() {
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                this.setBlock(x, y, null)
            }
        }
    }

    setSpeed(speed) {
        this._fallingPiece.speed = speed
    }

    move(right) {
        if (!this._fallingPiece) {
            return false
        }

        const fp = this._fallingPiece

        let scanX = fp.x
        if (right) {
            scanX += fp.rotation === PieceRotation.RIGHT ? 2 : 1
        } else {
            scanX -= fp.rotation === PieceRotation.LEFT ? 2 : 1
        }
        let scanStartY = Math.floor(fp.y)
        if (fp.rotation === PieceRotation.UP) {
            scanStartY--
        }
        let scanStopY = Math.ceil(fp.y)
        if (fp.rotation === PieceRotation.DOWN) {
            scanStopY++
        }

        for (let y = scanStartY; y <= scanStopY; y++) {
            let color = this.getBlock(scanX, y)
            if (color) {
                this._callbacks.onFallingPieceMoveRejected({...this._fallingPiece, right, color})
                return false
            }
        }

        this._fallingPiece.x = this._fallingPiece.x + (right ? 1 : -1)
        this._callbacks.onFallingPieceMoveSuccess({...this._fallingPiece, right})
        return true
    }

    rotate(clockwise = true) {
        if (!this._fallingPiece) {
            return false
        }

        const fp = this._fallingPiece

        let scanStartX = fp.x
        if (fp.rotation === PieceRotation.LEFT ||
            fp.rotation === PieceRotation.DOWN && clockwise ||
            fp.rotation === PieceRotation.UP && !clockwise) {
            scanStartX--
        } else if (fp.rotation === PieceRotation.DOWN || fp.rotation === PieceRotation.UP) {
            scanStartX++
        }
        let scanStopX = fp.x
        if (fp.rotation === PieceRotation.RIGHT) {
            scanStopX++
        } else if (fp.rotation === PieceRotation.DOWN || fp.rotation === PieceRotation.UP) {
            scanStopX = scanStartX
        }
        let scanStartY = Math.floor(fp.y)
        if (fp.rotation === PieceRotation.UP ||
            fp.rotation === PieceRotation.LEFT && clockwise ||
            fp.rotation === PieceRotation.RIGHT && !clockwise) {
            scanStartY--
        }
        let scanStopY = Math.ceil(fp.y)
        if (fp.rotation === PieceRotation.DOWN ||
            fp.rotation === PieceRotation.LEFT && !clockwise ||
            fp.rotation === PieceRotation.RIGHT && clockwise) {
            scanStopY++
        }

        for (let x = scanStartX; x <= scanStopX; x++) {
            for (let y = scanStartY; y <= scanStopY; y++) {
                const color = this.getBlock(x, y)
                if (color) {
                    this._callbacks.onFallingPieceRotateRejected({...this._fallingPiece, clockwise, color})
                    return false
                }
            }
        }

        this._fallingPiece.rotation = (this._fallingPiece.rotation + (clockwise ? 1 : -1) + 4) % 4
        this._callbacks.onFallingPieceRotateSuccess({...this._fallingPiece, clockwise})
        return true
    }

    advance(time) {
        if (!this._onWellAppearCalled) {
            this._callbacks.onWellAppear({
                width: this._width,
                height: this._height,
            })
            this._onWellAppearCalled = true
        }

        const fp = this._fallingPiece
        if (fp) {
            const targetY = fp.y + fp.speed * time

            let scanStartY = Math.floor(fp.y)
            let scanStopY = Math.ceil(targetY)
            if (fp.rotation === PieceRotation.DOWN) {
                scanStartY++
                scanStopY++
            }
            let scanStartX = fp.x
            if (fp.rotation === PieceRotation.LEFT) {
                scanStartX--
            }
            let scanStopX = fp.x
            if (fp.rotation === PieceRotation.RIGHT) {
                scanStopX++
            }

            for (let x = scanStartX; x <= scanStopX; x++) {
                for (let y = scanStartY; y <= scanStopY; y++) {
                    if (this.getBlock(x, y)) {
                        const dy1 = fp.rotation === PieceRotation.DOWN ? -2 : -1
                        const dx2 = fp.rotation === PieceRotation.LEFT ?
                            -1 : fp.rotation === PieceRotation.RIGHT ? 1 : 0
                        const dy2 = fp.rotation === PieceRotation.UP ?
                            -1 : fp.rotation === PieceRotation.DOWN ? 1 : 0

                        this.setBlock(fp.x, y + dy1, fp.color1)
                        this.setBlock(fp.x + dx2, y + dy1 + dy2, fp.color2)

                        this.startFallingPiece({
                            speed: fp.speed,
                        })

                        return
                    }
                }
            }

            fp.y = targetY
            this._callbacks.onFallingPieceFall({...fp})
        }
    }
}
