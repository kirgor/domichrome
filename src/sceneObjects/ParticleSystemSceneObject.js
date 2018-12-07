class ParticleSystemSceneObject extends SceneObject {
    constructor(x, y, z) {
        super()

        this.particleSystem = new THREE.GPUParticleSystem({
            maxParticles: 250000,
        })
        this.options = {
            position: new THREE.Vector3(x, y, z),
            positionRandomness: 0,
            velocity: new THREE.Vector3(1, 1, 0),
            velocityRandomness: 1.3,
            color: 0xffffff,
            colorRandomness: .2,
            turbulence: 0.3,
            lifetime: 2,
            size: 3,
            sizeRandomness: 1,
        }
    }

    getObject3D() {
        return this.particleSystem
    }

    _beforeRender(delta, elapsed) {
        for (let i = 0; i < 100 * delta; i++) {
            this.particleSystem.spawnParticle(this.options)
        }
        this.particleSystem.update(elapsed)
    }
}
