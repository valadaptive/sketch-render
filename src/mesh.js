import Item3D from './item3d';

class Mesh extends Item3D {
	constructor (renderer, primitives) {
		super(renderer);

		this._primitives = primitives;
	}

	draw () {
		for (const primitive of this._primitives) {
			primitive.drawAsItem(this);
		}
		super.draw();
	}
}

export default Mesh;
