import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.css'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 5)

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(cube);

const handleResize = () => {
  const { innerWidth, innerHeight } = window
  renderer.setSize(innerWidth, innerHeight)
}

const animate = () => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', handleResize);