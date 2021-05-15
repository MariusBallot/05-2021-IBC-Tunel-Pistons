import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import matTex from "../utils/matTex"

class Tunel {
    constructor() {
        this.bind()
        this.params = {
            sizeMult: 2
        }
        this.aR = window.innerWidth / window.innerHeight
    }

    init(scene) {
        this.scene = scene
        this.tunel
        this.modelLoader = new GLTFLoader()

        this.modelLoader.load('assets/models/tunel.glb', (glb) => {
            glb.scene.traverse(child => {
                if (child instanceof THREE.Mesh)
                    this.tunel = child
            })
            this.tunel.material = matTex.mat[0]
            this.tunel.scale.set(this.params.sizeMult * this.aR, this.params.sizeMult, 10)
            this.scene.add(this.tunel)
        })
    }

    update() {

    }

    resize() {
        this.aR = window.innerWidth / window.innerHeight
        this.tunel.scale.set(this.params.sizeMult * this.aR, this.params.sizeMult, 10)

    }

    bind() {

    }
}

const _instance = new Tunel()
export default _instance