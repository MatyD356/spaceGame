import * as THREE from 'three';

//skybox textures
import back from '../assets/back.png'
import down from '../assets/down.png'
import front from '../assets/front.png'
import left from '../assets/left.png'
import right from '../assets/right.png'
import up from '../assets/up.png'

const myTextures = [
  right,
  left,
  up,
  down,
  front,
  back,
]

export const addSkyBox = () => {
  const skyLoader = new THREE.CubeTextureLoader()
  const skyTextures = skyLoader.load(myTextures)
  return skyTextures
}


