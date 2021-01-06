import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100000)
camera.position.set(0, 0, 5)


const light = new THREE.AmbientLight(0xffffff);
scene.add(light);


const pointLight = new THREE.DirectionalLight(0xffffff, 1, 100);
pointLight.position.set(0, 10, 0);
pointLight.castShadow = true; // default false
scene.add(pointLight);

//Set up shadow properties for the light
pointLight.shadow.mapSize.width = 1024; // default 1024
pointLight.shadow.mapSize.height = 1024; // default 1024
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 100;

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x6CF05D });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.castShadow = true;
scene.add(cube);

const planeGeo = new THREE.PlaneGeometry(10, 10, 100, 100);
const planeMat = new THREE.MeshStandardMaterial({ color: 0xeb4034 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.material.side = THREE.DoubleSide;
plane.receiveShadow = true;
plane.position.set(0, -2, 0);
plane.rotation.set(Math.PI / 2, 0, 0);
scene.add(plane);

const handleResize = () => {
  const { innerWidth, innerHeight } = window
  renderer.setSize(innerWidth, innerHeight)
}
//Create a helper for the shadow camera (optional)

const helper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(helper);

const animate = () => {
  cube.rotation.y += 0.01
  cube.rotation.x += 0.01
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', handleResize);