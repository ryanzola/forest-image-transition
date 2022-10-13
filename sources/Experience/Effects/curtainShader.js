import { Vector2 } from 'three';

import vertex from '../Shader/curtain/vertex.glsl'
import fragment from '../Shader/curtain/fragment.glsl'

/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

const CurtainShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'uProgress': { value: 0.0 },
		'tSize': { value: new Vector2( 256, 256 ) },
		'center': { value: new Vector2( 0.5, 0.5 ) },
		'angle': { value: 1.57 },
		'scale': { value: 1.0 }

	},

	vertexShader: vertex,

	fragmentShader: fragment

};

export { CurtainShader };