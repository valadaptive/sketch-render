class Material {
	constructor (shader, color, texture = null) {
		this.shader = shader;
		this.color = color;
		this.texture = texture;
	}
}

export default Material;
