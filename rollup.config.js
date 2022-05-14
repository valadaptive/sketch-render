import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {string} from 'rollup-plugin-string';

export default {
	input: 'src/main.js',
	output: {
		format: 'iife',
		file: 'build/main.js',
		sourcemap: true
	},
	plugins: [
		resolve(),
		commonjs(),
		string({
			include: ['**/*.gltf', '**/*.glsl'],
		})
	]
};
