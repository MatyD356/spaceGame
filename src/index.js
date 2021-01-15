import './style.css'

import * as CANNON from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'


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

//variables
let scene, camera, world, controls, clock, renderer
const meshes = []
const bodies = []

const animate = () => {
  let delta = clock.getDelta()
  if (delta > .1) delta = .1
  world.step(delta)
  updateMeshPositions();
  //if (knightMixer) knightMixer.update(delta);
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
const updateMeshPositions = () => {
  for (var i = 0; i !== meshes.length; i++) {
    meshes[i].position.copy(bodies[i].position);
    meshes[i].quaternion.copy(bodies[i].quaternion);
  }
}

const initThree = () => {
  //scene
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 500, 10000);
  scene.background = addSkyBox()
  //renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight)
  //camera
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100000)
  camera.position.set(0, 15, 15)
  //lights
  const light = new THREE.AmbientLight(0xffffff);

  const pointLight = new THREE.SpotLight(0xffffff, 0.5, 100);
  pointLight.position.set(0, 10, 0);
  pointLight.castShadow = true; // default false

  const pointLight2 = new THREE.DirectionalLight(0xffffff, 0.5, 100);
  pointLight2.position.set(0, 10, 0);

  scene.add(light, pointLight, pointLight2);

  pointLight.shadow.camera.left = -1
  pointLight.shadow.camera.right = 1
  pointLight.shadow.camera.bottom = -1
  pointLight.shadow.radius = 10
  pointLight.shadow.camera.top = 1
  pointLight.shadow.mapSize.width = 1024; // default 1024
  pointLight.shadow.mapSize.height = 1024; // default 1024
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 10;

  clock = new THREE.Clock()
  controls = new OrbitControls(camera, renderer.domElement);
  cannonDebugger(scene, world.bodies)

  document.body.appendChild(renderer.domElement)
  window.addEventListener('resize', handleResize);
}

const handleResize = () => {
  const { innerWidth, innerHeight } = window
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight)
}
//CANNON
const initCannon = () => {
  world = new CANNON.World()
  world.broadphase = new CANNON.NaiveBroadphase()
  world.gravity.set(0, -9.82, 0)
}
const createBody = () => {
  //visuals
  const normalMaterial = new THREE.MeshNormalMaterial()
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const mesh = new THREE.Mesh(geometry, normalMaterial)
  mesh.position.set(0, 5, 0)
  scene.add(mesh)
  meshes.push(mesh);
  //physics
  const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  const body = new CANNON.Body({ mass: 1 })
  body.addShape(shape)
  body.position.set(mesh.position.x, mesh.position.y, mesh.position.z)
  world.addBody(body)
  bodies.push(body)
}
const createCube = () => {
  const normalMaterial = new THREE.MeshNormalMaterial()
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial)
  cubeMesh.position.x = -3
  cubeMesh.position.y = 3
  cubeMesh.castShadow = true
  const cubeShape = new CANNON.Box(new CANNON.Vec3(.5, .5, .5))
  const cubeBody = new CANNON.Body({ mass: 1 });
  cubeBody.addShape(cubeShape)
  cubeBody.position.x = cubeMesh.position.x
  cubeBody.position.y = cubeMesh.position.y
  cubeBody.position.z = cubeMesh.position.z
  return { mesh: cubeMesh, body: cubeBody }
}
const createPlane = () => {
  const planeGeo = new THREE.PlaneGeometry(100, 100, 100, 100);
  const planeMat = new THREE.MeshStandardMaterial({ color: 0xeb4034 });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.material.side = THREE.DoubleSide;
  plane.receiveShadow = true;
  plane.position.set(0, 0, 0);
  plane.rotation.set(Math.PI / 2, 0, 0);
  scene.add(plane);
  meshes.push(plane);
  //plane cannon
  const planeShape = new CANNON.Plane()
  const planeBody = new CANNON.Body({ mass: 0 })
  planeBody.addShape(planeShape)
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.addBody(planeBody)
  bodies.push(planeBody)
}
initCannon()
initThree()
createPlane()
createBody()
animate()



//--- EXAMPLES ---//
/* let knightCharacter = null
let knightMixer = null
const fbxLoader = new FBXLoader()
fbxLoader.load(knightModel, (fbx) => {
  knightCharacter = fbx
  knightMixer = new THREE.AnimationMixer()
  fbx.traverse((node) => {
    node.isMesh ? node.castShadow = true : null
  })
  const runLoader = new FBXLoader()
  runLoader.load(running, (anim) => {
    const run = knightMixer.clipAction(anim.animations[0], knightCharacter)
  })
  const animLoader = new FBXLoader()
  animLoader.load(breathingIdle, (anim) => {
    const idle = knightMixer.clipAction(anim.animations[0], knightCharacter)
    idle.play()
  })
  knightCharacter.scale.set(0.02, 0.02, 0.02)
  scene.add(knightCharacter)
}) */
//--- CONTROLS --- //
/*
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
}, false) */