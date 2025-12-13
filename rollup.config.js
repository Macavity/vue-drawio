import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import vue from 'rollup-plugin-vue';
import pkg from './package.json' with { type: 'json' };

const extensions = ['.js', '.ts', '.vue'];
const external = (_) => /node_modules/.test(_);
const plugins = () => [
  del({ targets: 'dist/*' }),
  vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag === 'iframe'
      }
    }
  }),
  nodeResolve({
    extensions
  }),
  typescript({
    tsconfig: './tsconfig.json',
    sourceMap: true,
    declaration: true,
    declarationMap: true
  })
];

export default {
  input: pkg.exports,
  plugins: plugins(),
  external,
  output: [
    {
      file: pkg.publishConfig.exports.import,
      format: 'es',
      sourcemap: true
    },
    {
      file: pkg.publishConfig.exports.require,
      format: 'cjs',
      sourcemap: true
    }
  ]
};
