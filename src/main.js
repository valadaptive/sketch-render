import Renderer from './renderer';
import Shader from './shader';
import Item3D from './item3d';
import GLTFImporter from './gltf-importer';

import fumoData from './fumo.gltf';
import vertShader from './shader_material_vert.glsl';
import fragShader from './shader_material_frag.glsl';

const mainCanvas = document.getElementById('main');

const renderer = new Renderer(mainCanvas, 600, 600);

const shader = new Shader(renderer.gl, vertShader, fragShader);

const brainImporter = new GLTFImporter(renderer, fumoData, shader);
const items = brainImporter.importScene(0);

const root = new Item3D(renderer);
for (const item of items) {
	root.appendChild(item);
}
root.scale.xyz = [0.75, 0.75, 0.75];

const fumo = items[4];
fumo.rotation.y = 120;

const camera = items[0]._children[0];
renderer.setCamera(camera);
const empty = new Item3D(renderer);
empty.appendChild(items[0]);

setInterval(() => {
	renderer.render(root);
	fumo.rotation.y -= 0.2;
}, 1 / 60);
