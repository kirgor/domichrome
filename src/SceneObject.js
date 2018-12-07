class SceneObject {
    getObject3D() {

    }

    _addTo(scene) {
        scene.add(this.getObject3D())
    }

    _removeFrom(scene) {
        scene.remove(this.getObject3D())
    }

    _beforeRender(delta, elapsed) {

    }
}
