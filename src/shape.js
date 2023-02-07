import '../css/style.css';
import {
  getRotate,
  getScale,
  getTranslate,
} from './transformations/transforms';
import {
  v3,
  fmap,
  combineTransforms as combineTransformations,
} from './transformations/base';
import { getGrid } from './surfaces';
import { getSimplex } from './transformations/noise';
import { okLabGradient, unpackColor } from './color';
import { rgb } from '@thi.ng/color';

export const gridSketch = () => {
  const grid = getGrid(8, 100);

  const objToWorld = combineTransformations(
    getTranslate(-0.5, 0.0, -0.5),
    getScale(10, 10, 10)
  );

  return (state) => {
    const { blur, slider1, transformations } = state;

    const noiseTransform = getSimplex(state.time + state.blur * 300, state);

    const worldGrid = fmap(
      grid,
      combineTransformations(
        noiseTransform,
        objToWorld,
        getRotate(v3(0, 1, 0), slider1),
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

export const drawBlurred = (drawFn, state, steps = 10) => {
  const increment = 1 / steps;
  for (let step = steps - 1; step >= 0; step--) {
    const t = 1 - step * increment;

    state.blurStep = step;
    state.blurSteps = steps;
    state.blur = t;

    drawFn(state);
  }
};
