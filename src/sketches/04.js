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
import { okLabGradient, setFillColor, unpackColor } from '../lib/color';
import { rgb, srgb } from '@thi.ng/color';
import { drawBlurred } from '../shape';
import crazy from '/img/img.png';
import { promisify } from '../util';

const getSimplex = (time, state) => {
  const seed = alea('seediesgs');
  const noise = createNoise2D(seed);

  return ([u, v]) => {
    const t = time * 4 * 1e-4 + state.blur * 1;
    const uvFactor = 2;
    const h = noise(u * uvFactor, v * uvFactor + t) * 0.03;
    const h2 = noise(20 + u * uvFactor - t, v * uvFactor) * 0.04;

    const hifreqTime = time * 1e-3;
    const hifreqUVFactor = 400;
    const hifreqH =
      noise(20 + u + hifreqUVFactor, 20 + v * hifreqUVFactor + hifreqTime) *
      0.01;

    return v4(u, 2 * h + h2 + hifreqH, v);
  };
};

const gridSketch = async () => {
  const grid = getGrid(4, 1);

  const img = await promisify((res, rej) => loadImage(crazy, res, rej));

  const objToWorld = combineTransformations(
    getTranslate(-0.5, 0.0, -0.5),
    getScale(7, 7, 7)
  );

  return (state) => {
    const { blur, transformations } = state;

    const noiseTransform = getSimplex(state.time + state.blur * 300, state);

    const worldGrid = fmap(
      grid,
      combineTransformations(
        noiseTransform,
        objToWorld,
        getRotate(v3(0, 1, 0), state.time * 0.001 + blur * 1),
        transformations.worldToScreen
      )
    );

    // const grad = okLabGradient(rgb(30, 100, 100), rgb(250, 192, 94));
    const grad = okLabGradient(rgb(250, 192, 94), rgb(250, 192, 94));

    // noFill();
    // strokeWeight(1);
    worldGrid.points.forEach((row) => {
      const opacity = blur * 255;

      setFillColor(srgb(0, 0, 0));
      row.forEach(([x, y]) => {
        fill(100, 100, 200, opacity);
        // ellipse(x, y, 6);
        // tint(255, opacity);
        image(img, x, y, 150, 150);
      });
      endShape();
    });
  };
};

const sketch04 = async (state) => {
  const grid = await gridSketch(state);
  const a = Math.round(Math.random() * 1e5);

  background(40, 40, 100);
  // grid(state);
  // frameRate(10);
  return (state) => {
    background(40, 40, 100);

    // grid(state);
    drawBlurred(grid, state, 90);
  };
};

export default sketch04;
