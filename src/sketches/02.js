import alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { normalDist } from '../lib/math';
import { getGrid } from '../lib/surfaces';
import { fmap } from '../lib/transformations/base';
import { getScale } from '../lib/transformations/transforms';

const flowFieldPath = (start, steps, stepSize, time = 0) => {
  const seed = alea('seediesgs');
  const noise = createNoise2D(seed);

  let path = [start];
  let [u, v] = start;
  const rng = new Array(steps).fill(0);

  for (let i = 0; i < steps; i++) {
    // const t = 50000;
    const t = time;
    const angle = noise(u * 0.01 * t * 1e-4, v * 0.01 + 3 - t * 1e-4) * 3;

    u += Math.cos(angle) * stepSize;
    v += Math.sin(angle) * stepSize;

    path.push([u, v]);
  }

  return path;
};

const sketch02 = (state) => {
  let grid = getGrid(40, 20);
  grid = fmap(grid, ([u, v]) => [u * 500 + 10, v * 300 + 100]);

  console.log(grid);

  return (state) => {
    background(245, 239, 237);

    fmap(grid, (start) => {
      const path = flowFieldPath(
        start,
        state.slider3[0] + state.slider3[1],
        2,
        state.time
      ).slice(state.slider3[0], state.slider3[0] + state.slider3[1]);
      stroke(10);
      noFill();
      beginShape();
      path.forEach(([u, v]) => {
        vertex(u, v);
      });
      endShape();
    });
    // stroke(255);
    // noFill();
    // beginShape();
    // path.forEach(([u, v]) => {
    //   vertex(u, v);
    // });
    // endShape();
  };
};

export default sketch02;
