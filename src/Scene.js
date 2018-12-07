class Scene {
    constructor(el) {
        this.el = el
        this.camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 1000)
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer()
        this.sceneObjects = []
    }

    getCamera() {
        return this.camera
    }

    add(sceneObject) {
        this.sceneObjects.push(sceneObject)
        sceneObject._addTo(this.scene)
    }

    remove(sceneObject) {
        this.sceneObjects = this.sceneObjects.filter(obj => obj !== sceneObject)
        sceneObject._removeFrom(this.scene)
    }

    run(beforeRender = () => null) {
        this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
        this.el.appendChild(this.renderer.domElement)

        const clock = new THREE.Clock()

        rafLoop(() => {
            const delta = clock.getDelta()
            const elapsed = clock.getElapsedTime()

            beforeRender(delta, elapsed)
            this.sceneObjects.forEach(obj => obj._beforeRender(delta, elapsed))
            this.renderer.render(this.scene, this.camera)
        })
    }
}
