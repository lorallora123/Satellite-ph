import * as THREE from 'three'
import { AnimationBlendMode, CompressedTextureLoader } from 'three'

class Planet extends THREE.Mesh {
    // gravity constant
    G = 6.673e-11;
    // radius of the planet
    radius = 0
    // mass of the planet
    mass = 0
    // position of the planet
    position = new THREE.Vector3(0, 0, 0)
    // velocity of the planet
    velocity = new THREE.Vector3(0, 0, 0)
    // acceleration of the planet
    acceleration = new THREE.Vector3(0, 0, 0)
    // force of the planet
    force = new THREE.Vector3(0, 0, 0)
    // constructor
    constructor(radius, mass, position, velocity ) {
        super()
        this.radius = radius
        this.mass = mass
        this.position = position
        this.velocity = velocity
    }
    
    // calculate the force of the planet
    calculateForce(other,anotherForce) {
        let rLength = Math.sqrt( (this.position.y-other.position.y)*(this.position.y-other.position.y) + (this.position.x-other.position.x)*(this.position.x-other.position.x) )
        let rLength2 = rLength * rLength
        let force = (this.G * other.mass * this.mass / rLength2) + anotherForce
        //console.log(force)
        let th = Math.atan2((this.position.y - other.position.y) ,(this.position.x - other.position.x))
        let forceVec = new THREE.Vector3(-force*Math.cos(th),-force*Math.sin(th),0);
        return forceVec
    }
    // calculate the acceleration of the planet
    calculateAcceleration(other,anotherForce) {
        this.force = this.calculateForce(other,anotherForce)
        let accX= this.force.x / this.mass
        let accY = this.force.y / this.mass
        return new THREE.Vector3(accX,accY,0);
    }
    // update the position of the planet
    updatePosition(deltaTime, other,anotherForce) {            //USE THIS
        this.acceleration = this.calculateAcceleration(other,anotherForce)
        this.velocity.x+= this.acceleration.x*deltaTime
        this.velocity.y+= this.acceleration.y*deltaTime
        this.velocity.z =0
        console.log(this.velocity)
        this.position.x+= this.velocity.x*deltaTime
        this.position.y+= this.velocity.y*deltaTime
        this.position.z =0
    }
    // update the angle of the planet
  
    /*changeForce(force,deltaTime,other){
        let th = Math.atan2((this.position.y - other.position.y) ,(this.position.x - other.position.x))
        this.force.x += force*Math.cos(th)
        this.force.y += force*Math.sin(th)
        let accX= this.force.x / this.mass
        let accY = this.force.y / this.mass
        this.acceleration = new THREE.Vector3(accX,accY,0);
        this.velocity.x+= this.acceleration.x*deltaTime
        this.velocity.y+= this.acceleration.y*deltaTime
        this.velocity.z =0
        console.log(this.force.x)
        this.position.x+= this.velocity.x*deltaTime
        this.position.y+= this.velocity.y*deltaTime
        this.position.z =0


    }*/

    changeMass(mass){
        this.mass=mass;
    }

    changeRadius(radius,other){
        let th = Math.atan2((this.position.y - other.position.y) ,(this.position.x - other.position.x))
        this.position.x = radius*Math.cos(th)
        this.position.y = radius*Math.sin(th)

    }

}

export default Planet;