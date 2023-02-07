import alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { v4 } from '../lib/transformations/base';
import {
  getRotate,
  getScale,
  getTranslate,
} from '../lib/transformations/transforms';
import {
  v3,
  fmap,
  combineTransforms as combineTransformations,
} from '../lib/transformations/base';
import { getGrid } from '../lib/surfaces';
import { okLabGradient, unpackColor } from '../lib/color';
import { rgb } from '@thi.ng/color';
import { drawBlurred } from '../shape';

const getSimplex = (time, state) => {
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

const gridSketch = () => {
  const grid = getGrid(8, 100);

  const objToWorld = combineTransformations(
    getTranslate(-0.5, 0.0, -0.5),
    getScale(10, 10, 10)
  );

  return (state) => {
    const { blur, transformations } = state;

    const noiseTransform = getSimplex(state.time + state.blur * 300, state);

    const worldGrid = fmap(
      grid,
      combineTransformations(
        noiseTransform,
        objToWorld,
        getRotate(v3(0, 1, 0), -Math.PI / 4),
        transformations.worldToScreen
      )
    );

    // const grad = okLabGradient(rgb(30, 100, 100), rgb(250, 192, 94));
    const grad = okLabGradient(rgb(250, 192, 94), rgb(250, 192, 94));

    noFill();
    strokeWeight(1);
    worldGrid.points.forEach((row) => {
      const opacity = blur * 255;

      stroke(...unpackColor(grad(blur)), opacity);
      beginShape();
      row.forEach(([x, y]) => {
        vertex(x, y);
      });
      endShape();
    });
  };
};

const sketch01 = (state) => {
  const grid = gridSketch(state);
  frameRate(0.5);

  return (state) => {
    background(245, 239, 237);
    fill(255);

    drawBlurred(grid, state, 24);
  };
};

export default sketch01;
