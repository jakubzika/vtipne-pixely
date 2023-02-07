import { mat4, vec4, vec3, vec2, mat2, mat3, glMatrix } from 'gl-matrix';
import alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { v4 } from './base';

export const getSimplex = (time, state) => {
  const seed = alea('seediesgs');
  const noise = createNoise2D(seed);

  return ([u, v]) => {
    const t = time * 4 * 1e-4;
    const uvFactor = 2;
    const h = noise(u * uvFactor, v * uvFactor + t) * 0.03;
    const h2 = noise(20 + u * uvFactor - t, v * uvFactor) * 0.04;

    const hifreqTime = time * 1e-3;
    const hifreqUVFactor = 400;
    const hifreqH =
      noise(20 + u + hifreqUVFactor, 20 + v * hifreqUVFactor + hifreqTime) *
      0.01;

    // return v4(
    //   u + 0.2 * noise(u + t * 0.8, v + t * 0.8),
    //   2 * h,
    //   v + 0.2 * noise(u + 20 + t * 0.8, -v * 0.8)
    // );
    return v4(u, 2 * h + h2 + hifreqH, v);
  };
};
