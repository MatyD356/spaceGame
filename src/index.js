import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './style.css'

import model from '../models/mathilde/scene.glb';
import carModel from '../models/car/scene.glb';


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


const pointLight = new THREE.SpotLight(0xffffff, 0.2, 100);
pointLight.position.set(0, 10, 0);
pointLight.castShadow = true; // default false
scene.add(pointLight);

const pointLight2 = new THREE.SpotLight(0xffffff, 0.7, 100);
pointLight2.position.set(0, 10, 0);
scene.add(pointLight2);

//Set up shadow properties for the light
/* pointLight.shadow.camera.left = -1
pointLight.shadow.camera.right = 1
pointLight.shadow.camera.bottom = -1
pointLight.shadow.radius = 10
pointLight.shadow.camera.top = 1
 */
pointLight.shadow.mapSize.width = 1024; // default 1024
pointLight.shadow.mapSize.height = 1024; // default 1024
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 10;
pointLight.shadow.focus = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x6CF05D });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.castShadow = true;

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
//Create a helper for the shadow camera (optional)

const helper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(helper);

const loader = new GLTFLoader();
let mathilda = null
loader.load(model, (gltf) => {
  gltf.scene.scale.set(0.02, 0.02, 0.02)
  gltf.scene.traverse((node) => {
    node.isMesh ? node.castShadow = true : null
  });
  gltf.scene.position.x = 2
  gltf.scene.position.z = 6
  gltf.scene.rotation.y = Math.PI / 2 + 0.5
  mathilda = gltf.scene
  scene.add(gltf.scene)
})

let car = null
loader.load(carModel, (gltf) => {
  gltf.scene.scale.set(0.02, 0.02, 0.02)
  gltf.scene.traverse((node) => {
    node.isMesh ? node.castShadow = true : null
  });
  car = gltf.scene
  car.position.y = 0.85;
  scene.add(gltf.scene)
})

const animate = () => {
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', handleResize);