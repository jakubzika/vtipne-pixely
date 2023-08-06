import { rgb, srgb } from '@thi.ng/color';
import alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { setStrokeColor, unpackRgb } from '../lib/color';
import { normalDist } from '../lib/math';
import { getGrid, uvToV3, uvToXY } from '../lib/surfaces';
import { combineTransforms, fmap, v3 } from '../lib/transformations/base';
import {
  getRotate2,
  getRotateAround2,
  getScale,
  getScale2,
  getTranslate,
  getTranslate2,
} from '../lib/transformations/transforms';

// const palette = ['#A56334', '#AD8844', '#2D4631', '#F7f1E9', '#1B2120'];
const palette = ['#1a2d22', '#384b2c', '#b98936', '#d6b579', '#f7f7f8'];

const getRandTransform = () => {
  const rnd = alea('asjlkdk');
  return ([u, v]) => [u + rnd() * 0.1, v + rnd() * 0.3];
};

const getSimplexRandTransform = (seed) => {
  const rnd = alea(seed);
  const noise = createNoise2D(rnd);

  return ([u, v, _]) =>
    v3(
      u + noise(u, v) * 0.3 + rnd() * 0.1,
      v + noise(u, v) * 0.3 + rnd() * 0.1
    );
};

const drawCurve = (points) => {
  noFill();
  beginShape();
  strokeWeight(1);
  // stroke(250);
  // setStrokeColor(rgb('#825D4D'));
  setStrokeColor(srgb(palette[0]));
  fmap(points, ([x, y]) => {
    vertex(x, y);
  });
  endShape();
};

const drawCurves = (grid) => {
  grid.points.map(drawCurve);
};

const sketch03 = (state) => {
  const grid = getGrid(40, 50);

  const transform = combineTransforms(
    getScale2(200, 200),
    getTranslate2(200, 200)
  );

  background(255);
  // frameRate(0.1);
  const transformed = fmap(
    grid,
    getSimplexRandTransform(state.time),
    transform
  );

  background(unpackRgb(srgb(palette[4])));

  // drawCurves(
  //   fmap(grid, getSimplexRandTransform('ssed'), transform, getTranslate2(0, 0))
  // );
  // drawCurves(
  //   fmap(grid, getSimplexRandTransform(';'), transform, getTranslate2(400, 0))
  // );
  // drawCurves(
  //   fmap(grid, getSimplexRandTransform('g'), transform, getTranslate2(0, 400))
  // );

  const transformedGrid = fmap(
    grid,
    uvToV3,
    getSimplexRandTransform('oiu'),

    transform,
    getTranslate2(400, 400)
  );

  return (state) => {
    background(unpackRgb(srgb(palette[4])));
    drawCurves(transformedGrid);
  };
};

export default sketch03;
