class Game {
    constructor(el) {
        this.el = el
        this.camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 1000)
        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer()
        this.children = []
    }

    getCamera() {
        return this.camera
    }

    add(child) {
        this.children.push(child)
        child._addTo(this.scene)
    }

    remove(child) {
        this.children = this.children.filter(obj => obj !== child)
        child._removeFrom(this.scene)
    }

    run(beforeRender = () => null) {
        this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
        this.el.appendChild(this.renderer.domElement)

        const clock = new THREE.Clock()

        rafLoop(() => {
            const delta = clock.getDelta()
            const elapsed = clock.getElapsedTime()

            beforeRender(delta, elapsed)
            this.children.forEach(obj => obj._beforeRender(delta, elapsed))
            this.renderer.render(this.scene, this.camera)
        })
    }
}
