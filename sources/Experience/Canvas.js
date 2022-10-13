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
    this.textures = []
    this.groups = []

    for(let i = 1; i < Object.keys(this.resources.items).length; i++) {
      this.textures.push(this.resources.items[i])
    }

    this.maskTexture = this.resources.items.mask
    this.event = createInputEvents(this.renderer.instance.domElement)
    this.mouse = new THREE.Vector2()
    this.mouseTarget = new THREE.Vector2()

    this.events()

    this.setObjects()

  }

  events() {
    this.event.on('move', ({ uv }) => {
      this.mouse.x = uv[0] - 0.5
      this.mouse.y = uv[1] - 0.5
    });
  }

  setObjects() {
    this.geometry = new THREE.PlaneGeometry(1920, 1080, 1, 1)

    this.textures.forEach((t, j) => {
      let group = new THREE.Group()

      this.scene.add(group)
      this.groups.push(group)

      for (let i = 0; i < 3; i++) {
        let m = new THREE.MeshBasicMaterial({
          map: t
        })
  
        if(i > 0) {
          m = new THREE.MeshBasicMaterial({
            map: t,
            alphaMap: this.maskTexture,
            transparent: true
          })
        }
  
        let mesh = new THREE.Mesh(this.geometry, m)
        mesh.position.z = (i + 1) * 100
        group.add(mesh)
        group.position.x = j * 2500
      }
    })

  }

  update() {
    this.mouseTarget.lerp(this.mouse, 0.05)
    
    this.groups.forEach(g => {
      g.rotation.x = -this.mouseTarget.y * 0.3;
      g.rotation.y = -this.mouseTarget.x * 0.3;
    })
  }
}