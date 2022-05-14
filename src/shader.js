import simplexNoise from './simplex-noise.glsl';

const VERSION = '#version 300 es\n';
const PRECISION = 'precision highp float;\n';

class Shader {
	constructor (gl, vertSource, fragSource) {
		const vertShader = this._createShader(gl, VERSION + PRECISION + simplexNoise + vertSource, gl.VERTEX_SHADER);
		const fragShader = this._createShader(gl, VERSION + PRECISION + simplexNoise + fragSource, gl.FRAGMENT_SHADER);

		const program = gl.createProgram();
		gl.attachShader(program, vertShader);
		gl.attachShader(program, fragShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const info = gl.getProgramInfoLog(program);
			throw new Error('Could not compile WebGL program. \n' + info);
		}

		this.program = program;

		this.attribLocations = {};
		this.uniformLocations = {};

		const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < numAttribs; i++) {
			const activeAttrib = gl.getActiveAttrib(program, i);
			this.attribLocations[activeAttrib.name] = gl.getAttribLocation(program, activeAttrib.name);
		}

		const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		for (let i = 0; i < numUniforms; i++) {
			const activeUniform = gl.getActiveUniform(program, i);
			this.uniformLocations[activeUniform.name] = gl.getUniformLocation(program, activeUniform.name);
		}
	}

	_createShader (gl, source, type) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const info = gl.getShaderInfoLog(shader);
			throw new Error('Could not compile WebGL program. \n' + info);
		}

		return shader;
	}
}

export default Shader;
