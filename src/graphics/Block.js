class Block extends GameObject3D {
    constructor(x, y, color) {
        super()

        this.object3d = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, PIECE_DEPTH),
            new THREE.MeshStandardMaterial({
                roughness: 0.1,
                color: blockColorToHex(color),
            }),
        )

        this.object3d.position.x = x + 0.5
        this.object3d.position.y = -y - 0.5
        this.object3d.position.z = 0.5 * (PIECE_DEPTH + 1)
    }
}
