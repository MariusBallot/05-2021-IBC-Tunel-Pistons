import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/RAF'
import config from '../utils/config'
import MyGUI from '../utils/MyGUI'

import Pistons from "./Pistons"
import Tunel from "./Tunel"
import CamParallax from "./CamParallax"

import simpleFrag from '../shaders/simple.frag'
import simpleVert from '../shaders/simple.vert'

class MainThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls
    }

    init(container) {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        container.appendChild(this.renderer.domElement)

        //MAIN SCENE INSTANCE
        let bgCol = new THREE.Color(0xffffff)
        let fog = new THREE.Fog(bgCol, 10, 20)
        this.scene = new THREE.Scene()
        this.scene.background = bgCol
        this.scene.fog = fog

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 5)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = config.controls
        this.controls.maxDistance = 1500
        this.controls.minDistance = 0

        CamParallax.init(this.camera)

        const cF = MyGUI.addFolder('Camera')
        cF.add(CamParallax, "active").name('Cam Parallax').onChange(() => {
            this.controls.enabled = false
        })
        cF.add(this.controls, "enabled").name('Orbit Cam').onChange(() => {
            CamParallax.active = false
        })

        Pistons.init(this.scene)
        Tunel.init(this.scene)

        MyGUI.hide()
        if (config.myGui)
            MyGUI.show()

        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        Pistons.update()
        CamParallax.update()
        this.renderer.render(this.scene, this.camera);
    }

    resizeCanvas() {
        Tunel.resize()
        Pistons.resize()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new MainThreeScene()
export default _instance