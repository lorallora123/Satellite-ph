import * as THREE from 'three'
import { AnimationBlendMode, CompressedTextureLoader } from 'three'

class Planet extends THREE.Mesh {
    // gravity constant
    G = 6.67e-19;
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
    calculateForce(other,deltaTime) {
        let rLength = Math.sqrt( (this.position.y-other.position.y)*(this.position.y-other.position.y) + (this.position.x-other.position.x)*(this.position.x-other.position.x) )
        let rLength2 = rLength * rLength
        let force = this.G * other.mass * this.mass / rLength2
        let th = Math.atan2((this.position.y - other.position.y) ,(this.position.x - other.position.x))
        //if(this.position.x<other.position.x || this.position.y<other.position.y)th+=Math.PI
        let forceVec = new THREE.Vector3(-force*Math.cos(th),-force*Math.sin(th),0);
        //console.log(forceVec);
        //console.log(th)
        
        return forceVec
    }
    // calculate the acceleration of the planet
    calculateAcceleration(other,deltaTime) {
        this.force = this.calculateForce(other,deltaTime)
        let accX= this.force.x / this.mass
        let accY = this.force.y / this.mass
        return new THREE.Vector3(accX,accY,0);
    }
    // update the position of the planet
    updatePosition(deltaTime, other) {            ////USE THIS
        this.acceleration = this.calculateAcceleration(other,deltaTime)
        this.velocity.x+= this.acceleration.x*deltaTime
        this.velocity.y+= this.acceleration.y*deltaTime
        this.velocity.z =0
        console.log(this.velocity)
        this.position.x+= this.velocity.x*deltaTime
        this.position.y+= this.velocity.y*deltaTime
        this.position.z =0
        

        //console.log(this.position);
        //this.position.multiplyScalar(1.0002);
    }
    // update the angle of the planet
  
    changeForce(force){
        this.force=force;
    }

    changeMass(mass){
        this.mass=mass;
    }

    changeRadius(radius){
        this.radius=radius;
    }

}

export default Planet;