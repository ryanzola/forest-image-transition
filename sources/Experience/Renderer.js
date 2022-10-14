import * as THREE from 'three'
import gsap from 'gsap'

import Experience from './Experience.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { CurtainShader } from './Effects/curtainShader.js'
import { RGBAShader } from './Effects/rgbaShader.js'

export default class Renderer {
    constructor(_options = {}) {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.imageIndex = 0

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('renderer')

            this.settings = {
                progress: 0,
                progress1: 0,
                runAnimation: () => {
                    this.runAnimation()
                }
            }

            this.debugFolder.add(this.settings, 'runAnimation')
        }

        this.usePostprocess = true

        this.setInstance()
        this.setPostProcess()

        setInterval(() => {
            this.imageIndex = (this.imageIndex % 15)
            this.imageIndex = this.imageIndex + 1 === 15 ? 0 : ++this.imageIndex
            console.log(this.imageIndex)

            this.runAnimation()
        }, 5000)
    }

    runAnimation() {
        let tl = gsap.timeline()
        
        // camera position
        tl.to(this.camera.modes['debug'].instance.position, {
            x: 2500 * this.imageIndex,
            duration: 1.5,
            ease: 'power4.inOut'
        })
        
        tl.to(this.camera.modes['debug'].instance.position, {
            z: 700,
            duration: 1,
            ease: 'power4.inOut'
        },0)
        tl.to(this.camera.modes['debug'].instance.position, {
            z: 900,
            duration: 1,
            ease: 'power4.inOut'
        },1)

        // post procesing
        tl.to(this.curtainShader.uniforms.uProgress, {
            value: 1,
            duration: 1,
            ease: 'power3.inOut'
        }, 0)
        tl.to(this.curtainShader.uniforms.uProgress, {
            value: 0,
            duration: 1,
            ease: 'power3.inOut'
        }, 1)
        tl.to(this.rgbaShader.uniforms.uProgress, {
            value: 1,
            duration: 1,
            ease: 'power3.inOut'
        }, 0)
        tl.to(this.rgbaShader.uniforms.uProgress, {
            value: 0,
            duration: 1,
            ease: 'power3.inOut'
        }, 1)
    }

    setInstance() {
        this.clearColor = '#010101'

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.physicallyCorrectLights = true
        // this.instance.gammaOutPut = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        // this.instance.shadowMap.enabled = false
        this.instance.toneMapping = THREE.NoToneMapping
        this.instance.toneMappingExposure = 1

        this.context = this.instance.getContext()

        // Add stats panel
        if (this.stats) {
            this.stats.setRenderPanel(this.context)
        }

        // Debug
        if (this.debug) {
            this.debugFolder
                .addColor(
                    this,
                    'clearColor'
                )
                .onChange(() => {
                    this.instance.setClearColor(this.clearColor)
                })

            this.debugFolder
                .add(
                    this.instance,
                    'toneMapping',
                    {
                        'NoToneMapping': THREE.NoToneMapping,
                        'LinearToneMapping': THREE.LinearToneMapping,
                        'ReinhardToneMapping': THREE.ReinhardToneMapping,
                        'CineonToneMapping': THREE.CineonToneMapping,
                        'ACESFilmicToneMapping': THREE.ACESFilmicToneMapping
                    }
                )
                .onChange(() => {
                    this.scene.traverse((_child) => {
                        if (_child instanceof THREE.Mesh)
                            _child.material.needsUpdate = true
                    })
                })

            this.debugFolder
                .add(
                    this.instance,
                    'toneMappingExposure'
                )
                .min(0)
                .max(10)
        }
    }

    setPostProcess() {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Effect composer
         */
        this.renderTarget = new THREE.WebGLRenderTarget(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                encoding: THREE.sRGBEncoding,
                samples: 2
            }
        )
        this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.postProcess.composer.addPass(this.postProcess.renderPass)

        this.curtainShader = new ShaderPass(CurtainShader)
        this.postProcess.composer.addPass(this.curtainShader)

        this.rgbaShader = new ShaderPass(RGBAShader)
        this.postProcess.composer.addPass(this.rgbaShader)

        // Debug
        if (this.debug) {
            this.debugFolder
                .add(this.settings, 'progress')
                .min(0)
                .max(1)
                .onChange((val) => {
                    this.curtainShader.uniforms.uProgress.value = val
                    this.rgbaShader.uniforms.uProgress.value = val
                })

            this.debugFolder
                .add(this.settings, 'progress1')
                .min(0)
                .max(1)
                .onChange((val) => {
                    this.curtainShader.uniforms.uProgress1.value = val
                })
        }
    }

    resize() {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    }

    update() {
        if (this.stats) {
            this.stats.beforeRender()
        }

        if (this.usePostprocess) {
            this.postProcess.composer.render()
        }
        else {
            this.instance.render(this.scene, this.camera.instance)
        }

        if (this.stats) {
            this.stats.afterRender()
        }
    }

    destroy() {
        this.instance.renderLists.dispose()
        this.instance.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}