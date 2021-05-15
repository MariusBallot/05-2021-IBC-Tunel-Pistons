import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import matTex from "../utils/matTex"
import RAF from "../utils/RAF"
import MyGUI from "../utils/MyGUI"

class Pistons {
    constructor() {
        this.bind()
        this.params = {
            instNum: {
                x: 16,
                y: 10,
                z: 40
            },
            zOffset: .5,
            scaleFac: .15,
            zSpeed: 0.001,
            waveFreq: 1,
            spacingFac: .36,
        }
        this.aR = window.innerWidth / window.innerHeight


        const pf = MyGUI.addFolder('Pistons')
        pf.open()
        pf.add(this.params.instNum, "x", 0, 30).step(1).name('x Instance').onChange(this.instancePistons)
        pf.add(this.params.instNum, "y", 0, 30).step(1).name('y Instance').onChange(this.instancePistons)
        pf.add(this.params, "spacingFac", 0, 1.5).step(0.0001).name('Spacing').onChange(this.instancePistons)
        pf.add(this.params, "scaleFac", .05, .4).step(0.0001).name('Scaling').onChange(this.instancePistons)
        pf.add(this.params, "zSpeed", 0, 0.005).step(0.0001).name('Speed')
        pf.add(this.params, "waveFreq", 0, 2).step(0.0001).name('Wave Fequency')
    }

    init(scene) {
        this.scene = scene
        this.piston
        this.pistons = new THREE.Group()
        this.modelLoader = new GLTFLoader()

        this.modelLoader.load('assets/models/piston.glb', (glb) => {
            glb.scene.traverse(child => {
                if (child instanceof THREE.Mesh)
                    child.material = matTex.mat[0]

                if (child instanceof THREE.Mesh && child.name == "piston-base")
                    this.piston = child
            })
            this.instancePistons()
        })

    }

    instancePistons() {
        this.pistons.clear()
        this.piston.scale.set(this.params.scaleFac, this.params.scaleFac, this.params.scaleFac)

        for (let z = 0; z < this.params.instNum.z; z++) {

            for (let x = 0; x < this.params.instNum.x; x++) {
                let c1 = this.piston.clone()
                let c2 = this.piston.clone()
                c2.rotation.x = Math.PI
                let xp = (x - (this.params.instNum.x - 1) / 2) * this.params.spacingFac

                c1.position.set(xp, -2, -z * this.params.zOffset);
                c2.position.set(xp, 2, -z * this.params.zOffset);
                this.pistons.add(c1, c2)
            }
            for (let y = 0; y < this.params.instNum.y; y++) {
                let c1 = this.piston.clone()
                let c2 = this.piston.clone()
                c1.rotation.z = Math.PI / 2
                c2.rotation.z = -Math.PI / 2
                let yp = (y - this.params.instNum.y / 2) * this.params.spacingFac

                c1.position.set(2 * this.aR, yp, -z * this.params.zOffset);
                c2.position.set(-2 * this.aR, yp, -z * this.params.zOffset);
                console.log(c2.position)
                this.pistons.add(c1, c2)
            }
        }

        this.scene.add(this.pistons)
    }

    update() {
        let i = 0
        while (i < this.pistons.children.length) {
            let d = this.pistons.children[i].position.distanceTo(this.scene.position)
            this.pistons.children[i].children[0].position.y = Math.sin(d * this.params.waveFreq)


            this.pistons.children[i].position.z += this.params.zSpeed * RAF.dt
            if (this.pistons.children[i].position.z >= 0) {
                this.pistons.children[i].position.z = -this.params.instNum.z * this.params.zOffset
            }

            i++
        }


    }

    resize() {
        this.aR = window.innerWidth / window.innerHeight
        this.instancePistons()
    }

    bind() {
        this.instancePistons = this.instancePistons.bind(this)
        this.resize = this.resize.bind(this)
    }
}

const _instance = new Pistons()
export default _instance