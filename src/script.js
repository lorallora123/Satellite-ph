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
const earthtexture = new Three.TextureLoader().load('/textures/plants/earth.jpg')
const marstexture = new Three.TextureLoader().load('/textures/plants/mars.jpg')
const mercurytexture = new Three.TextureLoader().load('/textures/plants/mercury.jpg')

//const starsexture = new Three.TextureLoader().load('/textures/plants/stars.jpg')


/// debug
 const gui=new dat.GUI({closed:true})
 const p={
  radius:2
}

// const parematers ={
//   color: 0xffd0a0,
//   rotatex:()=>{
//     gsap.to(sphere.rotation,{duration:2,x:sphere.rotation.x+10})
//   },
//   rotatey:()=>{
//     gsap.to(sphere.rotation,{duration:2,y:sphere.rotation.y+10})
//   },
//   rotatez:()=>{
//     gsap.to(sphere.rotation,{duration:2,z:sphere.rotation.z+10})
//   }
// }

////

// cursor
// const cursor ={
//   x:0,
//   y:0
// }
/// canvas
const canvas = document.querySelector('.webgl')

// window.addEventListener('mousemove',(event)=> {
//   cursor.x=event.clientX /sizes.width -0.5
//   cursor.y= - (event.clientY /sizes.height -0.5)

// })


/// scene
const scene = new Three.Scene()


/**
 * models
 */
 const glftLoader = new GLTFLoader()
 let obj;
 glftLoader.load(
     '/models/satellite/scene.gltf',
     (glft)=>{
         obj=glft.scene;
        //  obj.position.x=-5
        // console.log(obj.position);
         scene.add(glft.scene);
     }
 )
//  var light = new THREE.HemisphereLight(0xffffff,0x000000,10)
//  scene.add(light)
// console.log(obj.position);
//scene.background= new THREE.Color(0xff0000)

const material1 = new Three.MeshStandardMaterial({
  map: earthtexture
})
const material2 = new Three.MeshStandardMaterial({
  map: earthtexture
})
const material3 = new Three.MeshStandardMaterial({
  map: marstexture
})
const material4 = new Three.MeshStandardMaterial({
  map: mercurytexture
})
const Group = new Three.Group()


//////sun
const sun = new Three.Mesh(new Three.SphereBufferGeometry(p.radius, 64, 32, 6.283, 6.283, 0, 6.2831), material1)
////////////

////planets
const plan = new Three.Mesh(new Three.SphereBufferGeometry(0.8, 64, 32, 6.283, 6.283, 0, 6.2831), material4)

const plan1 = new Three.Mesh(new Three.SphereBufferGeometry(0.8, 64, 32, 6.283, 6.283, 0, 6.2831), material3)
const plan2 = new Three.Mesh(new Three.SphereBufferGeometry(0.8, 64, 32, 6.283, 6.283, 0, 6.2831), material2)
//////////////

// planet
const earthMass = 5.97e24;
const planet = new Planet(1, earthMass, new Three.Vector3(0, 0, 0), new Three.Vector3(0, 0, 0));


// another planet
const planet2 = new Planet(1, 6500, new Three.Vector3(-6771, 0, 0), new Three.Vector3(0, -242547.281,0));

///orbit

const orbit = new Three.Mesh(new Three.TorusGeometry(6, 0.005, 2, 200, 6.2831), new Three.MeshStandardMaterial())
const orbit1 = new Three.Mesh(new Three.TorusGeometry(10, 0.005, 2, 200, 6.2831), new Three.MeshStandardMaterial())

const orbit2 = new Three.Mesh(new Three.TorusGeometry(14, 0.005, 2, 200, 6.2831), new Three.MeshStandardMaterial())
///////////////

Group.add(orbit2, orbit1, orbit)
Group.rotation.x = 90




plan.position.x = -7
plan1.position.x = -11.5
plan2.position.x = -17
orbit.position.x = -1
orbit1.position.x = -1.5
orbit2.position.x = -3
scene.add(sun)

// debug
// gui.addColor(parematers,'color').onChange(()=>{
//   material.color.set(parematers.color)
//   })
// // gui.add(sphere.position,'y',-3,3,0.01).name('cube y')
// gui.add()





gui.add(p,'radius',-1,2,0.1).name('radius').onChange(()=>{
      
    })
// gui.add(sun.position,'x',-3,3,0.01).name('cube x')
// // gui.add(sphere.position,'z',-3,3,0.01).name('cube z')
// gui.add(material ,'visible')
// gui.add(material,'wireframe')
// gui.add(parematers,'rotatex')
// gui.add(parematers,'rotatey')
// gui.add(parematers,'rotatez')



/// light 
const ambientlight = new Three.AmbientLight(0xffffff, 0.5)
scene.add(ambientlight)
const pointlight = new Three.PointLight(0xffffff, 0.5)
pointlight.position.x = 2
pointlight.position.y = 3
pointlight.position.z = 4
scene.add(pointlight)

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
const camera = new Three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3

// camera.lookAt(sphere.position)




scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/// renderer
const renderer = new Three.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new Three.Clock()
const tick = () => {
  const elapsedtime = clock.getElapsedTime()
  const deltaTime=clock.getDelta()
  sun.rotation.y = elapsedtime
  planet2.updatePosition(deltaTime,planet)
  // console.log(obj.position.x);
  
  // console.log(planet2.position.x);
  // obj.position.x=planet2.position.x
  // obj.position.y=planet2.position.y

 
   controls.update()
  //renderer
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
