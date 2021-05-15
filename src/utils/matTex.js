import * as THREE from 'three'
let texLoader = new THREE.TextureLoader()

let mcTex = texLoader.load('assets/textures/matcap01.jpg')

const matTex = {
    mat: [
        new THREE.MeshMatcapMaterial({
            matcap: mcTex
        })
    ],
    tex: [
        mcTex
    ]

}

export default matTex