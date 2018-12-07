class SimpleSceneObject extends SceneObject {
    constructor(object3d) {
        super()
        this.object3d = object3d
    }

    getObject3D() {
        return this.object3d
    }
}
