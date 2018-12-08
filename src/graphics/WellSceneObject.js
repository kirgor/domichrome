class WellSceneObject extends GameObject3D {
    constructor(width, height) {
        super()

        this.mesh1 = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, 1),
            new THREE.MeshStandardMaterial({
                color: WELL_COLOR,
                roughness: 1,
            }),
        )

        this.mesh2 = new THREE.Mesh(
            new THREE.BoxGeometry(WELL_WALL_WIDTH, height, WELL_DEPTH),
            new THREE.MeshStandardMaterial({
                color: WELL_COLOR,
            }),
        )
        this.mesh2.position.x = (-width - WELL_WALL_WIDTH) / 2
        this.mesh2.position.z = WELL_DEPTH / 2

        this.mesh3 = new THREE.Mesh(
            new THREE.BoxGeometry(WELL_WALL_WIDTH, height, WELL_DEPTH),
            new THREE.MeshStandardMaterial({
                color: WELL_COLOR,
            }),
        )
        this.mesh3.position.x = (width + WELL_WALL_WIDTH) / 2
        this.mesh3.position.z = WELL_DEPTH / 2

        this.mesh4 = new THREE.Mesh(
            new THREE.BoxGeometry(width + WELL_WALL_WIDTH * 2, WELL_WALL_WIDTH, WELL_DEPTH),
            new THREE.MeshStandardMaterial({
                color: WELL_COLOR,
            }),
        )
        this.mesh4.position.y = (-height - WELL_WALL_WIDTH) / 2
        this.mesh4.position.z = WELL_DEPTH / 2

        this.object3d = new THREE.Group()
        this.object3d.add(this.mesh1)
        this.object3d.add(this.mesh2)
        this.object3d.add(this.mesh3)
        this.object3d.add(this.mesh4)

        this.object3d.position.x = width / 2
        this.object3d.position.y = -height / 2
    }
}
