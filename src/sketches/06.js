import { oklab, parseHex, rgb, srgb } from '@thi.ng/color';
import { okLabGradient, setFillColor, unpackRgb } from '../lib/color';
import { getGrid } from '../lib/surfaces';
import { fmap } from '../lib/transformations/base';
import { drawBlurred } from '../shape';
import { createNoise2D } from 'simplex-noise';

const pixelFn = () => {
  loadPixels();
  let d = pixelDensity();
  console.log('pixel density', d);
  console.log(pixels);

  updatePixels();
};

const sketch06 = async (state) => {
  const a = Math.round(Math.random() * 1e5);

  const grid = getGrid(600, 100);
  const gradientGrid = getGrid(1, 1);

  const gradient = okLabGradient(
    srgb(parseHex('#1045F5')),
    srgb(parseHex('#20893C'))
    // srgb(parseHex('#20893C'))
  );

  // frameRate(25);

  const noise = createNoise2D();
  const locNoise = createNoise2D();

  setFillColor(srgb(parseHex('#20893C')));

  const gridSpace = 600;
  return (state) => {
    console.log('draw');
    background(255);

    fmap(gradientGrid, ([gu, gv]) => {
      fmap(grid, ([u, v]) => {
        fill(0);
        // const color = gradient(
        //   -0.5 +
        //     (u + v) +
        //     0.4 * noise(gu * 100 + state.time / 1000, gv * 100 + v * 4)
        // );
        const col = gradient(Math.floor(u * 10) / 10);
        // setFillColor(srgb(parseHex('#20893C')));
        setFillColor(col);
        rect(
          200 +
            gu * 450 +
            u * gridSpace +
            10 * locNoise(10 * v + 0.5 * u * 10, state.time * 0.0005),
          200 +
            gv * 450 +
            v * gridSpace +
            +10 * locNoise(state.time * 0.0005, v * 10 - 10 * u),
          locNoise(u * 10, v * 10) * 5 + 0,
          locNoise(u * 100, v * 10) * 10 + 5
        );
      });
    });

    fill(0);
    textSize(30);
    text('as', 100, 100);
    frameRate(0);
  };
};

export default sketch06;
