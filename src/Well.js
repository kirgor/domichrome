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
        if (x < 0 || x >= this._width || y > this._height) {
            return BlockColor.BOUNDARY
        }

        // Blocks above well are always empty
        if (y < 0) {
            return null
        }

        return this._blocks[y * this._width + x]
    }

    setBlock(x, y, color = null) {
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
        color1,
        color2,
        rotation = PieceRotation.RIGHT,
        speed = 0,
    }) {
        if (this._fallingPiece) {
            this._callbacks.onFallingPieceDisappear()
        }

        this._fallingPiece = {x: this._width / 2, y: 0, color1, color2, rotation, speed}
        this._callbacks.onFallingPieceAppear({...this._fallingPiece})
    }

    accelerate(a) {
        this._fallingPiece.speed += a
    }

    move(right) {
        if (!this._fallingPiece) {
            return
        }

        const rp = this._roundedFallingPiece()
        const inc = right ? 1 : -1

        let min = 0
        let max = this._width - 1
        if (rp.rotation === PieceRotation.RIGHT) {
            max--
        } else if (rp.rotation === PieceRotation.LEFT) {
            min++
        }

        const x = this._fallingPiece.x + inc
        if (x >= min && x <= max) {
            this._fallingPiece.x = x
            this._callbacks.onFallingPieceMoveSuccess({...this._fallingPiece, right})
        } else {
            this._callbacks.onFallingPieceMoveRejected({...this._fallingPiece, right})
        }
    }

    rotate(clockwise = true) {
        if (!this._fallingPiece) {
            return
        }

        const rp = this._roundedFallingPiece()
        const inc = clockwise ? 1 : -1

        if (rp.rotation === PieceRotation.RIGHT) {
            if (this.getBlock(rp.x, rp.y) ||
                this.getBlock(rp.x + 1, rp.y) ||
                this.getBlock(rp.x + 1, rp.y + inc) ||
                this.getBlock(rp.x, rp.y + inc)) {
                this._callbacks.onFallingPieceRotateRejected({...this._fallingPiece, clockwise})
                return
            }
        } else if (rp.rotation === PieceRotation.DOWN) {
            if (this.getBlock(rp.x, rp.y) ||
                this.getBlock(rp.x, rp.y + 1) ||
                this.getBlock(rp.x - inc, rp.y + 1) ||
                this.getBlock(rp.x - inc, rp.y)) {
                this._callbacks.onFallingPieceRotateRejected({...this._fallingPiece, clockwise})
                return
            }
        } else if (rp.rotation === PieceRotation.LEFT) {
            if (this.getBlock(rp.x, rp.y) ||
                this.getBlock(rp.x - 1, rp.y) ||
                this.getBlock(rp.x - 1, rp.y - inc) ||
                this.getBlock(rp.x, rp.y - inc)) {
                this._callbacks.onFallingPieceRotateRejected({...this._fallingPiece, clockwise})
                return
            }
        } else if (rp.rotation === PieceRotation.UP) {
            if (this.getBlock(rp.x, rp.y) ||
                this.getBlock(rp.x, rp.y - 1) ||
                this.getBlock(rp.x + inc, rp.y - 1) ||
                this.getBlock(rp.x + inc, rp.y)) {
                this._callbacks.onFallingPieceRotateRejected({...this._fallingPiece, clockwise})
                return
            }
        }

        this._fallingPiece.rotation = (this._fallingPiece.rotation + inc + 4) % 4
        this._callbacks.onFallingPieceRotateSuccess({...this._fallingPiece, clockwise})
    }

    advance(time) {
        if (!this._onWellAppearCalled) {
            this._callbacks.onWellAppear({
                width: this._width,
                height: this._height,
            })
            this._onWellAppearCalled = true
        }

        if (this._fallingPiece) {
            this._fallingPiece.y += this._fallingPiece.speed * time
            this._callbacks.onFallingPieceFall({...this._fallingPiece})
        }
    }

    _roundedFallingPiece() {
        const piece = this._fallingPiece
        return {
            ...piece,
            x: Math.round(piece.x),
            y: Math.round(piece.y),
        }
    }
}