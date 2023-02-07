import { mat4, vec4, vec3, vec2, mat2, mat3, glMatrix } from 'gl-matrix';
import { v4 } from './transformations/base';

export const uvToXZ = ([u, v]) => v4(u, 0, v);

const gridMap = (grid, trans) => ({
  ...grid,
  points: grid.points.map((row) => row.map(trans)),
});

/**
 * @param {number} rows
 * @param {number} cols
 */
export const getGrid = (uSubdivisions, vSubdivisions) => {
  const uStep = 1 / (uSubdivisions - 1);
  const vStep = 1 / (vSubdivisions - 1);
  let grid = [];

  for (let u = 0; u <= 1; u += uStep) {
    let row = [];
    for (let v = 0; v <= 1; v += vStep) {
      row.push(vec2.fromValues(u, v));
    }
    grid.push(row);
  }

  return {
    subdivisions: [uSubdivisions, vSubdivisions],
    points: grid,
    type: 'grid',
    map: gridMap,
  };
};

export const getRect = () => [
  v4(-1, 0, -1, 1),
  v4(1, 0, -1, 1),
  v4(1, 0, 1, 1),
  v4(-1, 0, 1, 1),
];

export const getCube = () => [
  v4(-1, 1, -1, 1),
  v4(1, 1, -1, 1),
  v4(1, 1, 1, 1),
  v4(-1, 1, 1, 1),

  v4(-1, -1, -1, 1),
  v4(1, -1, -1, 1),
  v4(1, -1, 1, 1),
  v4(-1, -1, 1, 1),
];
