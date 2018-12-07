class BlockSceneObject extends SceneObject {
    constructor(x, y, color) {
        super()

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, PIECE_DEPTH),
            new THREE.MeshStandardMaterial({
                roughness: 0.1,
                color: blockColorToHex(color)
            }),
        )

        this.mesh.position.x = x + 0.5
        this.mesh.position.y = -y - 0.5
        this.mesh.position.z = 0.5 * (PIECE_DEPTH + 1)
    }

    getObject3D() {
        return this.mesh
    }
}
