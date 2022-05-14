import {mat4} from 'gl-matrix';
import Shader from './shader.js';

import outlineVertSource from './shader_outline_vert.glsl';
import outlineFragSource from './shader_outline_frag.glsl';

const __viewMatrix = mat4.create();

const createFramebuffer = (gl, attachmentDescs, renderbufferFormat) => {
	const framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	const attachments = [];
	for (const {attachment, format, internalFormat, type} of attachmentDescs) {
		const fbTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, fbTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, fbTexture, 0);
		attachments.push({
			attachment,
			texture: fbTexture,
			format,
			internalFormat,
			type
		});
	}
	const renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	let attachment;
	switch (renderbufferFormat) {
		case gl.DEPTH_COMPONENT16:
		case gl.DEPTH_COMPONENT24:
		case gl.DEPTH_COMPONENT32F:
			attachment = gl.DEPTH_ATTACHMENT;
			break;
		case gl.STENCIL_INDEX8:
			attachment = gl.STENCIL_ATTACHMENT;
			break;
		case gl.DEPTH_STENCIL:
		case gl.DEPTH24_STENCIL8:
		case gl.DEPTH32F_STENCIL8:
			attachment = gl.DEPTH_STENCIL_ATTACHMENT;
			break;
	}
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderbuffer);

	return {
		framebuffer,
		attachments,
		renderbuffer: {
			renderbuffer,
			format: renderbufferFormat
		}
	};
};

class Renderer {
	constructor (canvas, width, height) {
		this.canvas = canvas;

		const gl = canvas.getContext('webgl2', {antialias: false, stencil: true, depth: true});
		this.gl = gl;
		this._camera = null;
		this._viewProjectionMatrix = mat4.create();
		this._time = 0;
		gl.enable(gl.DEPTH_TEST);

		this._interBuffer = createFramebuffer(gl, [
			{
				attachment: gl.COLOR_ATTACHMENT0,
				format: gl.RGBA,
				internalFormat: gl.RGBA,
				type: gl.UNSIGNED_BYTE
			},
			{
				attachment: gl.COLOR_ATTACHMENT1,
				format: gl.RED_INTEGER,
				internalFormat: gl.R32UI,
				type: gl.UNSIGNED_INT
			},
			{
				attachment: gl.COLOR_ATTACHMENT2,
				format: gl.RGBA,
				internalFormat: gl.RGBA,
				type: gl.UNSIGNED_BYTE
			}
		], gl.DEPTH_STENCIL);
		this._outlineShader = new Shader(gl, outlineVertSource, outlineFragSource);
		const rectBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				0, 0,
				0, 1,
				1, 0,

				1, 1,
				0, 1,
				1, 0
			]),
			gl.STATIC_DRAW
		);
		this._rectBuffer = rectBuffer;

		this.resize(width, height);
	}

	resize (width, height) {
		const {gl} = this;
		// TODO set camera projection matrices dirty
		this.canvas.width = width;
		this.canvas.height = height;
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

		for (const {framebuffer, attachments, renderbuffer} of [this._interBuffer]) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
			for (const {texture, format, internalFormat, type} of attachments) {
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.texImage2D(
					gl.TEXTURE_2D,
					0,
					internalFormat,
					gl.drawingBufferWidth,
					gl.drawingBufferHeight,
					0,
					format,
					type,
					null
				);
			}
			gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer.renderbuffer);
			gl.renderbufferStorage(
				gl.RENDERBUFFER,
				renderbuffer.format,
				gl.drawingBufferWidth,
				gl.drawingBufferHeight
			);
		}
	}

	setCamera (camera) {
		this._camera = camera;
	}

	render (rootItem) {
		this._time = (Date.now() - 1652477321435) / 1000;
		mat4.invert(__viewMatrix, this._camera.transformMatrix);
		mat4.multiply(this._viewProjectionMatrix, this._camera.projectionMatrix, __viewMatrix);

		const {gl} = this;
		gl.bindFramebuffer(gl.FRAMEBUFFER, this._interBuffer.framebuffer);
		gl.clearColor(0, 0, 0, 0);
		gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawBuffers([
			gl.COLOR_ATTACHMENT0,
			gl.COLOR_ATTACHMENT1,
			gl.COLOR_ATTACHMENT2
		]);
		gl.clearBufferuiv(gl.COLOR, 1, [0, 0, 0, 0]);
		gl.clearBufferfv(gl.COLOR, 2, [0, 0, 0, 0]);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);

		rootItem.draw();

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram(this._outlineShader.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._rectBuffer);
		gl.vertexAttribPointer(
			this._outlineShader.attribLocations.a_position,
			2, //vec2
			gl.FLOAT,
			false,
			0,
			0
		);

		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(this._outlineShader.uniformLocations.u_texture, 0);
		gl.bindTexture(gl.TEXTURE_2D, this._interBuffer.attachments[0].texture);

		gl.activeTexture(gl.TEXTURE1);
		gl.uniform1i(this._outlineShader.uniformLocations.u_matIndex, 1);
		gl.bindTexture(gl.TEXTURE_2D, this._interBuffer.attachments[1].texture);

		gl.activeTexture(gl.TEXTURE2);
		gl.uniform1i(this._outlineShader.uniformLocations.u_normal, 2);
		gl.bindTexture(gl.TEXTURE_2D, this._interBuffer.attachments[2].texture);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	rebindUniforms (item, shader) {
		const {gl} = this;
		gl.uniformMatrix4fv(shader.uniformLocations.u_projMatrix, false, this._viewProjectionMatrix);
		gl.uniformMatrix4fv(shader.uniformLocations.u_objMatrix, false, item.transformMatrix);
		gl.uniformMatrix3fv(shader.uniformLocations.u_normalMatrix, false, item.normalMatrix);
		gl.uniform1i(shader.uniformLocations.u_flip, item._flipNormals);
		gl.uniform1f(shader.uniformLocations.u_fcoef, 2 / (Math.log2(this._camera.zFar + 1.0)));
		gl.uniform1f(shader.uniformLocations.u_time, this._time);
	}
}

export default Renderer;
