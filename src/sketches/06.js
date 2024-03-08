import { oklab, parseHex, rgb, srgb } from '@thi.ng/color';
import { okLabGradient, setBackground, setFillColor } from '../lib/color';
import { getGrid } from '../lib/surfaces';
import { fmap } from '../lib/transformations/base';
import { createNoise2D } from 'simplex-noise';

const pixelFn = () => {
  loadPixels();
  let d = pixelDensity();
  console.log('pixel density', d);
  console.log(pixels);
  pixels[10] = 0;
  pixels[11] = 255;
  pixels[12] = 0;

  updatePixels();
};

const sketch06 = async (state) => {
  const canvas = document.getElementById('defaultCanvas0');
  canvas.style.imageRendering = 'pixelated';

  const a = Math.round(Math.random() * 1e5);

  const grid = getGrid(600, 100);

  const gradientGrid = getGrid(1, 1);

  const gradient = okLabGradient(
    srgb(parseHex('#1045F5')),
    srgb(parseHex('#20893C'))
  );

  const colorStrip = getGrid(100, 1);

  // const font = await loadFont('PicNic.otf');

  // frameRate(25);

  const noise = createNoise2D();
  const locNoise = createNoise2D();

  setFillColor(srgb(parseHex('#20893C')));

  const gridSpace = 600;
  return (state) => {
    console.log('draw');
    setBackground(srgb(parseHex('#E7EBE2')));

    fmap(gradientGrid, ([gu, gv]) => {
      fmap(grid, ([u, v]) => {
        fill(0);

        const col = gradient(noise(u * 150, v * 2) * 5);
        // const col = gradient(Math.floor(u * 10) / 10);
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

    fmap(colorStrip, ([u, v]) => {
      const col = gradient(noise(u * 150, v * 2) * 5);

      setFillColor(col);
      rect(50 + u * 200, 20 + 2, 10);
    });

    fill(0);
    textSize(30);

    textStyle('bold');

    // text('FOO BAR BAZ', 400, 900);
    pixelFn();
    frameRate(0);
  };
};

export default sketch06;
