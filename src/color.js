import {
  multiColorGradient,
  oklab,
  oklabRgb,
  rgb,
  rgbOklab,
  srgb,
} from '@thi.ng/color';

export const testColors = () => {
  const grad = okLabGradient(rgb(255, 0, 0), rgb(0, 0, 255));
  console.log(grad(0.5).buf);
};

/**
 *
 * @param {RGB} colA
 * @param {RGB} colB
 * @param {*} n
 */
export const okLabGradient = (colA, colB) => {
  const b = oklab(colA);
  const a = oklab(colB);

  return (t) => {
    return rgb(
      oklab(
        t * a[0] + (1 - t) * b[0],
        t * a[1] + (1 - t) * b[1],
        t * a[2] + (1 - t) * b[2]
      )
    );
  };
};

export const unpackColor = (col) => [col[0], col[1], col[2]];
