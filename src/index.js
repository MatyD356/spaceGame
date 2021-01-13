import './style.css'

//THREE imports
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

//models
import knightModel from '../models/knight/castle_guard_01.fbx'

//animations
import breathingIdle from '../models/animations/Breathing-Idle.fbx'
import running from '../models/animations/Running.fbx'

//skybox
import { addSkyBox } from './skyBox'


const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100000)
camera.position.set(0, 15, 15)

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

scene.background = addSkyBox()

const pointLight = new THREE.SpotLight(0xffffff, 0.5, 100);
pointLight.position.set(0, 10, 0);
pointLight.castShadow = true; // default false
scene.add(pointLight);

const pointLight2 = new THREE.DirectionalLight(0xffffff, 0.5, 100);
pointLight2.position.set(0, 10, 0);
scene.add(pointLight2);

pointLight.shadow.camera.left = -1
pointLight.shadow.camera.right = 1
pointLight.shadow.camera.bottom = -1
pointLight.shadow.radius = 10
pointLight.shadow.camera.top = 1
pointLight.shadow.mapSize.width = 1024; // default 1024
pointLight.shadow.mapSize.height = 1024; // default 1024
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 10;

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

/* const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x6CF05D });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.castShadow = true; */

const planeGeo = new THREE.PlaneGeometry(100, 100, 100, 100);
const planeMat = new THREE.MeshStandardMaterial({ color: 0xeb4034 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.material.side = THREE.DoubleSide;
plane.receiveShadow = true;
plane.position.set(0, 0, 0);
plane.rotation.set(Math.PI / 2, 0, 0);
scene.add(plane);

const handleResize = () => {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight)
}

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
  })
  knight.scale.set(0.02, 0.02, 0.02)
  scene.add(knight)
})

const clock = new THREE.Clock()

const animate = () => {
  let delta = clock.getDelta();
  if (knightMixer) knightMixer.update(delta);
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
window.addEventListener('resize', handleResize);

//--- CONTROLS --- //

const movement = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  space: false,
  shift: false,
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      movement.forward = true
      break
    case 's':
      movement.backward = true
      break
    case 'd':
      movement.right = true
      break
    case 'a':
      movement.left = true
      break
    case 'shift':
      movement.shift = true
      break
    case 'space':
      movement.space = true
      break
    default:
      break
  }
}, false)
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      movement.forward = false
      break
    case 's':
      movement.backward = false
      break
    case 'd':
      movement.right = false
      break
    case 'a':
      movement.left = false
      break
    case 'shift':
      movement.shift = false
      break
    case 'space':
      movement.space = false
      break
    default:
      break
  }
}, false)