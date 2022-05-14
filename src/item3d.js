import {mat3, mat4, vec3, quat} from 'gl-matrix';

const vecGetterSetter = (obj, prop, numAxes) => {
	const dimensions = ['x', 'y', 'z', 'w'];
	const gs = {};


	for (let i = 0; i < numAxes; i++) {
		const dim = dimensions[i];

		Object.defineProperty(gs, dim, {
			configurable: true,
			enumerable: true,
			get () {
				return obj[prop][i];
			},
			set (newValue) {
				obj[prop][i] = newValue;
				obj._setTransformDirty();
			}
		});
	}

	Object.defineProperty(gs, dimensions.slice(0, numAxes).join(''), {
		configurable: true,
		enumerable: true,
		get () {
			return obj[prop];
		},
		set (newValue) {
			obj[prop] = new Float32Array(newValue);
			obj._setTransformDirty();
		}
	});

	return gs;
};

const __quat = quat.create();

class Item3D {
	constructor (renderer) {
		this._renderer = renderer;
		this.gl = renderer.gl;

		this._transformMatrix = mat4.create();
		this._normalMatrix = mat3.create();
		this._flipNormals = false;
		this._center = vec3.create();
		this._position = vec3.create();
		this._useQuaternions = false;
		this._rotationEuler = vec3.create();
		this._rotationQuat = quat.create();
		this._scale = vec3.fromValues(1, 1, 1);

		this.center = vecGetterSetter(this, '_center', 3);
		this.position = vecGetterSetter(this, '_position', 3);
		this.useQuaternions = false;
		this.scale = vecGetterSetter(this, '_scale', 3);

		this._transformDirty = true;

		this._parent = null;
		this._children = [];
	}

	get useQuaternions () {
		return this._useQuaternions;
	}

	set useQuaternions (useQuaternions) {
		if (useQuaternions) {
			this.rotation = vecGetterSetter(this, '_rotationQuat', 4);
		} else {
			this.rotation = vecGetterSetter(this, '_rotationEuler', 3);
		}
		this._useQuaternions = useQuaternions;
	}

	get transformMatrix () {
		if (this._transformDirty) {
			this._calculateTransform();
		}

		return this._transformMatrix;
	}

	get normalMatrix () {
		if (this._transformDirty) {
			this._calculateTransform();
		}

		return this._normalMatrix;
	}

	_setTransformDirty () {
		this._transformDirty = true;
		for (const child of this._children) {
			child._setTransformDirty();
		}
	}

	_calculateTransform () {
		mat4.fromRotationTranslationScaleOrigin(
			this._transformMatrix,
			this._useQuaternions ?
				this._rotationQuat :
				quat.fromEuler(__quat, this._rotationEuler[0], this._rotationEuler[1], this._rotationEuler[2]),
			this._position,
			this._scale,
			this._center
		);

		if (this._parent !== null) {
			mat4.multiply(this._transformMatrix, this._parent.transformMatrix, this._transformMatrix);
		}

		mat3.fromMat4(this._normalMatrix, this._transformMatrix);
		mat3.invert(this._normalMatrix, this._normalMatrix);
		mat3.transpose(this._normalMatrix, this._normalMatrix);
		// Correct for negative scale flipping normals
		const det = mat3.determinant(this._normalMatrix);
		this._flipNormals = det < 0;

		this._transformDirty = false;
	}

	appendChild (child) {
		this._children.push(child);

		child._parent = this;
		child._setTransformDirty();
	}

	removeChild (child) {
		if (typeof child === 'number') {
			if (child >= this._children.length) return;
			this._children.splice(child, 1);
			child = this._children[child];
		} else {
			const childIndex = this._children.indexOf(child);
			if (childIndex === -1) return;
			this._children.splice(child, 1);
		}

		child._parent = null;
		child._setTransformDirty();
	}

	draw () {
		for (const child of this._children) {
			child.draw();
		}
	}
}

export default Item3D;
