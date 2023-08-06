import { mat4, vec4, vec3, vec2, mat2, mat3, glMatrix } from 'gl-matrix';

/**
 *
 * @param {mat2 | mat3 | mat4} mat
 */
export const showMatrix = (mat) => {
  const size = Math.sqrt(mat.length);
  let res = '';
  for (let y = 0; y < size; y++) {
    res += Array.from(mat.slice(y * size, y * size + size))
      .map((v) => `${Math.round(v * 1e3) / 1e3}`.padStart(6, ' '))
      .join(' ');
    res += '\n';
  }
  console.log(res);
};

/**
 *
 * @param  {...(p: any) => any} transformations
 * @returns <A,B>(p: A) => B
 */
export const combineTransforms = (...transformations) => {
  return (p) => transformations.reduce((v, trans, idx) => trans(v), p);
};

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} w
 * @returns
 */
export const v4 = (x, y, z, w = 1) => vec4.fromValues(x, y, z, w);

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @returns
 */
export const v3 = (x, y, w = 1) => vec3.fromValues(x, y, w);

/**
 *
 * @param {[number, number]} p uv coords
 * @param  {...any} transformations
 * @returns
 */
export const fmap = (p, ...transformations) => {
  const transform = combineTransforms(...transformations);
  if (Array.isArray(p)) {
    return p.map((v) => transform(v));
  }
  if ('map' in p) {
    return p.map(p, transform);
  }
};
