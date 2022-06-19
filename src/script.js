import './style.css'
import * as Three from 'three'
import  Planet  from './physics/Planet'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui'



/**
 * texture
 */
const suntexture = new Three.TextureLoader().load('/textures/plants/sun.jpg')

const marstexture = new Three.TextureLoader().load('/textures/plants/mars.jpg')
const mercurytexture = new Three.TextureLoader().load('/textures/plants/mercury.jpg')




/// debug
 const gui=new dat.GUI({closed:true})
 const p={
  radius:1000
}




/// canvas
const canvas = document.querySelector('.webgl')



/// scene
const scene = new Three.Scene()
/////////////////////////////////////////////////

//background
const loader = new Three.CubeTextureLoader()
const pic= loader.load([
  '/textures/plants/stars.jpg',
  '/textures/plants/stars.jpg',
  '/textures/plants/stars.jpg',
  '/textures/plants/stars.jpg',
  '/textures/plants/stars.jpg',
  '/textures/plants/stars.jpg'
])
scene.background=pic
 
///////////////////////////////////////

//Create a new ambient light
var light11 = new Three.AmbientLight( 0xffffff)
scene.add( light11 )

///////////////
const light = new Three.DirectionalLight(0x999999,5);
scene.add(light);
/////////

//////////////////////////////////

// to draw earth 
const geomet = new Three.SphereBufferGeometry(2000, 32,32)
const mater = new Three.MeshPhongMaterial({
  map: Three.ImageUtils.loadTexture('/textures/plants/earth.jpg'),
})
 const earthMM = new Three.Mesh(geomet , mater)
 mater.bumpMap = Three.ImageUtils.loadTexture('/textures/plants/earthbump1k.jpg')
 mater.bumpScale = 0.010

mater.specularMap = Three.ImageUtils.loadTexture('/textures/plants/earthspec1k.jpg')
mater.specular= new Three.Color(0x888888)


const material4 = new Three.MeshStandardMaterial({
  map: mercurytexture
})

/// models
 
 const obj = new Three.Object3D();
 const glftloader = new GLTFLoader();
 glftloader.load('./models/satellite/scene.gltf',function(gltf) {
     const model = gltf.scene;
     obj.add(model);
  
     obj.scale.set(250,250,250)
     obj.rotation.x += 200
     scene.add(obj);
 }
)




obj.position.x = 7771

scene.add(earthMM)
scene.add(obj)
const parematers={
  masssatellite:6500,
  massplanet:5.98e24,
  distance:7771,
  force:0,
}



gui.add(parematers,'masssatellite').name('mass satellite :');
gui.add(parematers,'massplanet').name('mass planet :');
gui.add(parematers,'distance').name('distance :');
gui.add(parematers,'force').name('force :');





/// size
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth
}
/// resize
window.addEventListener('resize', () => {
  // update sizes
  sizes.height = window.innerHeight,
    sizes.width = window.innerWidth
  //update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // update renderer
  renderer.setSize(sizes.width, sizes.height)

})
window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  }
  else {
    document.exitFullscreen()
  }
})

/// camera
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000000)
camera.position.z = 30000

scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// planet
const small = 1e-8;
const earthMass = 5.98e21;
const moonMass = 6500;
const dist = 7771;
const G = 6.67e-11;
const speed = Math.sqrt(G*earthMass/dist)
console.log(speed)
const planet = new Planet(1, earthMass, new Three.Vector3(0, 0, 0), new Three.Vector3(0, 0, 0));

// another planet
const planet2 = new Planet(1, moonMass, new Three.Vector3(dist, 0, 0), new Three.Vector3(0, speed,0));

// renderer
const renderer = new Three.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

 
const clock = new Three.Clock()
const tick = () => {
  const deltaTime=clock.getDelta()
  //sun.rotation.y = elapsedtime
  earthMM.rotation.y += 0.01
  let p1 = new Three.Vector3(obj.position.x, obj.position.y, obj.position.z);
  planet2.updatePosition(deltaTime*2,planet,parematers.force)
  planet.changeMass(parematers.massplanet/1000);
  planet2.changeMass(parematers.masssatellite);
  planet2.changeRadius(parematers.distance,planet);
  //planet2.changeForce(parematers.force,deltaTime,planet)
    
  obj.position.set(planet2.position.x,planet2.position.y,planet2.position.z)
  let p2 = new Three.Vector3(obj.position.x, obj.position.y, obj.position.z);
  //draw line
  const geometry = new Three.Geometry()
  geometry.vertices.push(p1)
  geometry.vertices.push(p2)
  const material = new Three.LineBasicMaterial({
    color: 0xffffff
  })
  const line = new Three.Line(geometry, material)
  scene.add(line)
  setTimeout(() => {
    scene.remove(line)
  }
    , 40000);
  controls.update()
  //renderer
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
