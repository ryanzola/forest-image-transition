import * as THREE from 'three'
import Experience from './Experience.js'

import createInputEvents from './Utils/InputEvents.js'

export default class Canvas {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.renderer = this.experience.renderer
    this.config = this.experience.config
    this.resources = this.experience.resources
    this.maskTexture = this.resources.items.mask
    this.event = createInputEvents(this.renderer.instance.domElement)

    this.events()
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  events() {
    this.event.on('move', ({ position, event, inside, dragging }) => {
      // mousemove / touchmove
      console.log(position); // [ x, y ]
      console.log(event); // original mouse/touch event 
      console.log(inside); // true if the mouse/touch is inside the element
      console.log(dragging); // true if the pointer was down/dragging
    });
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(1920, 1080, 1, 1)
  }

  setMaterial() {
    this.group = new THREE.Group()
    this.scene.add(this.group)
    for (let i = 0; i < 3; i++) {
      let m = new THREE.MeshBasicMaterial({
        map: this.resources.items[4]
      })

      if(i > 0) {
        m = new THREE.MeshBasicMaterial({
          map: this.resources.items[4],
          alphaMap: this.resources.items.mask,
          transparent: true
        })
      }

      let mesh = new THREE.Mesh(this.geometry, m)
      mesh.position.z = (i + 1) * 100
      this.group.add(mesh)
    }


    // this.material = new THREE.MeshBasicMaterial({
    //   map: this.resources.items[1]
    // })
  }

  setMesh() {
    // this.mesh = new THREE.Mesh(this.geometry, this.material)
    // this.scene.add(this.mesh)
  }

  update() {}
}