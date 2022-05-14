import {mat4} from 'gl-matrix';

import Item3D from './item3d';

class Camera extends Item3D {
	constructor (renderer, fov, zNear = 0.01, zFar = 100) {
		super(renderer);

		this._fov = fov;
		this._zNear = zNear;
		this._zFar = zFar;
		this._projectionMatrix = mat4.create();
		this._projectionMatrixDirty = true;
	}

	get fov () {
		return this._fov;
	}

	set fov (fov) {
		this._fov = fov;
		this._projectionMatrixDirty = true;
	}

	_setTransformDirty () {
		super._setTransformDirty();
		this._projectionMatrixDirty = true;
	}

	get projectionMatrix () {
		if (this._projectionMatrixDirty) {
			mat4.perspective(
				this._projectionMatrix,
				this._fov,
				this.gl.drawingBufferWidth / this.gl.drawingBufferHeight,
				this._zNear,
				this._zFar
			);
			this._projectionMatrixDirty = false;
		}

		return this._projectionMatrix;
	}
}

export default Camera;
