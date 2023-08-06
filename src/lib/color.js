import { oklab, rgb, srgb } from '@thi.ng/color';

export const testColors = () => {};

/**
 *
 * @param {RGB} colA
 * @param {RGB} colB
 * @param {*} n
 */
export const okLabGradient = (colA, colB) => {
  const a = oklab(colA);
  const b = oklab(colB);

  return (t) => {
    return srgb(
      oklab(
        t * a[0] + (1 - t) * b[0],
        t * a[1] + (1 - t) * b[1],
        t * a[2] + (1 - t) * b[2]
      )
    );
  };
};

export const unpackColor = (col) => [col[0], col[1], col[2]];

export const setStrokeColor = (col) => {
  stroke(...unpackRgb(col));
};
export const setFillColor = (col) => {
  fill(...unpackRgb(col));
};
export const setBackground = (col, opacity) => {
  background(...unpackRgb(col), opacity);
};

export const unpackRgb = (col) => unpackColor(col.buf).map((x) => x * 255);
