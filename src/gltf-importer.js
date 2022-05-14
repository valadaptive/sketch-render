import Material from './material';
import MeshPrimitive from './mesh-primitive';
import Mesh from './mesh';
import Item3D from './item3d';
import Camera from './camera';

const uriToArrayBuffer = uri => {
	const URI_REGEX = /^data:[a-z+-]+\/[a-z+-]+;base64,/;
	const match = URI_REGEX.exec(uri);
	if (!match) throw new Error('Unsupported URI');

	const binaryString = window.atob(uri.slice(match[0].length));
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
};

const componentsPerType = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
};

class GLTFImporter {
	constructor (renderer, file, shader) {
		this.renderer = renderer;
		this.gl = renderer.gl;
		this.data = JSON.parse(file);

		this._arrayBuffers = new Map();
		this._buffers = new Map();
		this._elementBuffers = new Map();
		this._meshData = new Map();
		this._materials = new Map();
		this._images = new Map();
		this._textures = new Map();
		this._matShader = shader;
	}

	getArrayBuffer (index) {
		if (!this._arrayBuffers.has(index)) {
			const arrayBuffer = uriToArrayBuffer(this.data.buffers[index].uri);
			this._arrayBuffers.set(index, arrayBuffer);
		}
		return this._arrayBuffers.get(index);
	}

	getBuffer (index) {
		const buffers = this._buffers;
		const gl = this.gl;
		if (!buffers.has(index)) {
			const arrayBuffer = this.getArrayBuffer(index);
			const glBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);
			buffers.set(index, {arrayBuffer, glBuffer});
		}

		return buffers.get(index);
	}

	getElementBuffer (bufferViewIndex) {
		const elementBuffers = this._elementBuffers;
		const gl = this.gl;
		if (!elementBuffers.has(bufferViewIndex)) {
			const bufferView = this.data.bufferViews[bufferViewIndex];
			const {arrayBuffer} = this.getBuffer(bufferView.buffer);
			const subData = new Uint8Array(arrayBuffer, bufferView.byteOffset, bufferView.byteLength);
			const glBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, subData, gl.STATIC_DRAW);
			elementBuffers.set(bufferViewIndex, glBuffer);
		}

		return elementBuffers.get(bufferViewIndex);
	}

	importScene (index) {
		const scene = this.data.scenes[index];
		const items = [];
		for (let i = 0; i < scene.nodes.length; i++) {
			items.push(this.importNode(scene.nodes[i]));
		}

		return items;
	}

	importNode (index) {
		let item;
		const gltfNode = this.data.nodes[index];
		if ('mesh' in gltfNode) {
			const primitives = this.importMeshData(gltfNode.mesh);
			item = new Mesh(this.renderer, primitives);
		} else if ('camera' in gltfNode) {
			const cameraData = this.data.cameras[gltfNode.camera];
			if (cameraData.type !== 'perspective') {
				throw new Error('Non-perspective cameras not supported');
			}
			const {yfov, znear, zfar} = cameraData.perspective;
			item = new Camera(this.renderer, yfov, znear, zfar);
		} else {
			item = new Item3D(this.renderer);
		}

		if ('children' in gltfNode) {
			for (const child of gltfNode.children) {
				item.appendChild(this.importNode(child));
			}
		}

		item.name = gltfNode.name;

		if (gltfNode.translation) item.position.xyz = gltfNode.translation;
		if (gltfNode.scale) item.scale.xyz = gltfNode.scale;
		if (gltfNode.rotation) {
			item.useQuaternions = true;
			item.rotation.xyzw = gltfNode.rotation;
		}

		return item;
	}

	importMeshData (index) {
		if (this._meshData.has(index)) return this._meshData.get(index);

		const mesh = this.data.meshes[index];
		const primitives = [];
		for (const primitive of mesh.primitives) {
			const material = this.importMaterial(primitive.material);

			if (typeof primitive.indices !== 'number') {
				throw new Error('Non-indexed primitives not implemented');
			}

			const attributes = [];

			for (const attributeName of Object.keys(primitive.attributes)) {
				const accessor = this.data.accessors[primitive.attributes[attributeName]];

				if (accessor.sparse) {
					throw new Error('Sparse accessors not implemented');
				}

				const bufferView = this.data.bufferViews[accessor.bufferView];
				const {glBuffer} = this.getBuffer(bufferView.buffer);

				const attribLocation = this._matShader.attribLocations[attributeName];
				if (typeof attribLocation !== 'number') {
					// eslint-disable-next-line no-console
					console.warn(`Shader for '${material}' missing attribute '${attributeName}'`);
					continue;
				}

				attributes.push({
					buffer: glBuffer,
					name: attributeName,
					location: attribLocation,
					numComponents: componentsPerType[accessor.type],
					componentType: accessor.componentType,
					byteStride: bufferView.byteStride || 0,
					byteOffset: bufferView.byteOffset
				});
			}

			const elementAccessor = this.data.accessors[primitive.indices];
			const elementBuffer = {
				buffer: this.getElementBuffer(elementAccessor.bufferView),
				count: elementAccessor.count,
				componentType: elementAccessor.componentType
			};

			primitives.push(new MeshPrimitive(this.renderer, attributes, elementBuffer, material));
		}

		this._meshData.set(index, primitives);

		return primitives;
	}

	importMaterial (index) {
		if (this._materials.has(index)) return this._materials.get(index);

		const materialData = this.data.materials[index];
		let texture = null;
		if (materialData.pbrMetallicRoughness?.baseColorTexture) {
			texture = this.importTexture(materialData.pbrMetallicRoughness?.baseColorTexture.index);
		}
		const matColor = materialData.pbrMetallicRoughness?.baseColorFactor ?? [0.5, 0.5, 0.5, 1];
		const material = new Material(this._matShader, matColor, texture);
		this._materials.set(index, material);

		return material;
	}

	importTexture (index) {
		if (this._textures.has(index)) return this._textures.get(index);
		const {gl} = this;
		const textureData = this.data.textures[index];

		const imagePromise = this.importImage(textureData.source);
		const texture = gl.createTexture();

		imagePromise.then(image => {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA,
				image.naturalWidth,
				image.naturalHeight,
				0,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				image
			);
		});

		this._textures.set(index, texture);
		return texture;
	}

	importImage (index) {
		if (this._images.has(index)) return this._images.get(index);
		const image = this.data.images[index];
		const bufferView = this.data.bufferViews[image.bufferView];
		const buffer = this.getArrayBuffer(bufferView.buffer);

		const arr = new Uint8Array(buffer, bufferView.byteOffset, bufferView.byteLength);
		const blob = new Blob([arr], {type: image.mimeType});
		const url = URL.createObjectURL(blob);
		const img = document.createElement('img');
		img.src = url;

		const imagePromise = new Promise((resolve, reject) => {
			img.onload = () => {
				resolve(img);
			};

			img.onerror = err => {
				reject(err);
			};
		});
		this._images.set(index, imagePromise);
		return imagePromise;
	}
}

export default GLTFImporter;
