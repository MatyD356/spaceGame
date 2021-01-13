import knightModel from '../models/knight/castle_guard_01.fbx'

let knight = null
let knightMixer = null
const fbxLoader = new FBXLoader()
fbxLoader.load(knightModel, (fbx) => {
  knight = fbx
  knightMixer = new THREE.AnimationMixer(knight)
  fbx.traverse((node) => {
    node.isMesh ? node.castShadow = true : null
  })
  const animLoader = new FBXLoader()
  animLoader.load(breathingIdle, (anim) => {
    const idle = knightMixer.clipAction(anim.animations[0], knight)
    idle.play()
  })
  const runLoader = new FBXLoader()
  runLoader.load(running, (anim) => {
    const run = knightMixer.clipAction(anim.animations[0], knight)
    run.play()
  })
  knight.rotation.y = 2 / Math.PI;
  knight.scale.set(0.02, 0.02, 0.02)
  scene.add(knight)
})

class knight {
  constructor() {
    this.animations = []
  }
  addAnimation() {

  }
}