class GameObject3D extends GameChild {
    constructor(object3d) {
        super()
        this.object3d = object3d
    }

    getObject3D() {
        return this.object3d
    }

    _addTo(scene) {
        scene.add(this.getObject3D())
    }

    _removeFrom(scene) {
        scene.remove(this.getObject3D())
    }
}
