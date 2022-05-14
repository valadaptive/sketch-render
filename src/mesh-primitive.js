class MeshPrimitive {
	constructor (renderer, attributes, indexBuffer, material) {
		this.renderer = renderer;
		this.attributes = attributes;
		this.indexBuffer = indexBuffer;
		this.material = material;
		this.gl = renderer.gl;
	}

	drawAsItem (item) {
		const gl = this.gl;

		const shader = this.material.shader;
		gl.useProgram(shader.program);
		this.renderer.rebindUniforms(item, shader);
		gl.uniform4fv(shader.uniformLocations.u_color, this.material.color);

		if (this.material.texture) {
			gl.uniform1i(shader.uniformLocations.u_texture, 0);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
		}

		gl.uniform1i(shader.uniformLocations.u_useTexture, this.material.texture ? 1 : 0);

		for (const attribute of this.attributes) {
			const {buffer, location, numComponents, componentType, byteStride, byteOffset} = attribute;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(
				location,
				numComponents,
				componentType,
				false,
				byteStride,
				byteOffset
			);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.buffer);
		gl.drawElements(
			gl.TRIANGLES,
			this.indexBuffer.count,
			this.indexBuffer.componentType,
			0
		);
	}
}

export default MeshPrimitive;
