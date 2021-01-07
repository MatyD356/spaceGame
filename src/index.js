import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './style.css'
import model from '../models/scene.glb';

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


const pointLight = new THREE.DirectionalLight(0xffffff, 1, 100);
pointLight.position.set(0, 10, 0);
pointLight.castShadow = true; // default false
scene.add(pointLight);

//Set up shadow properties for the light
pointLight.shadow.camera.left = -1
pointLight.shadow.camera.right = 1
pointLight.shadow.camera.top = 1
pointLight.shadow.camera.bottom = -1

pointLight.shadow.mapSize.width = 512; // default 1024
pointLight.shadow.mapSize.height = 512; // default 1024
pointLight.shadow.camera.near = 5;
pointLight.shadow.camera.far = 400;

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x6CF05D });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.castShadow = true;

const planeGeo = new THREE.PlaneGeometry(10, 10, 100, 100);
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
loader.load(model, (gltf) => {
  gltf.scene.scale.set(0.02, 0.02, 0.02)
  gltf.scene.traverse((node) => {
    node.isMesh ? node.castShadow = true : null
  });
  scene.add(gltf.scene)
})

const animate = () => {
  cube.rotation.y += 0.01
  cube.rotation.x += 0.01
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', handleResize);