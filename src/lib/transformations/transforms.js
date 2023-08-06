import { mat4, vec4, vec3, vec2, mat2, mat3, glMatrix } from 'gl-matrix';
import { WIDTH, HEIGHT } from '../../const';
import { combineTransforms, showMatrix, v3, v4, fmap } from './base';

export const getCamera = (from, at, up) => {
  const cameraM = mat4.lookAt(mat4.create(), from, at, up);
  return (p) => vec4.transformMat4(p, p, cameraM);
};

export const getPerspectiveProjection = () => {
  const perspectiveM = mat4.perspective(
    mat4.create(),
    0.8,
    WIDTH / HEIGHT,
    1,
    null
  );
  return (p) => vec4.transformMat4(p, p, perspectiveM);
};

export const getOrthographicProjection = () => {
  const orthoM = mat4.ortho(mat4.create(), -10, 10, -10, 10, 0, 100);
  return (p) => vec4.transformMat4(p, p, orthoM);
};

export const getViewport = () => {
  const viewportM = mat3.create();
  mat3.scale(viewportM, viewportM, [WIDTH / 2, HEIGHT / 2]);
  mat3.translate(viewportM, viewportM, [1, 1]);

  return (p) => {
    const x = p[0];
    const y = p[1];
    const w = p[3];
    // perspective division
    const screen = vec2.fromValues(x / w, y / w);
    vec2.transformMat3(screen, screen, viewportM);
    return screen;
  };
};

export const getWorldToScreen = () => {
  const proj = getPerspectiveProjection();
  const view = getViewport();

  return combineTransforms(proj, view);
};

export const getTranslate = (x, y, z) => {
  const translateM = mat4.fromTranslation(mat4.create(), [x, y, z]);

  return (p) => {
    return vec4.transformMat4(p, p, translateM);
  };
};

export const getScale = (x, y, z) => {
  const scaleM = mat4.fromScaling(mat4.create(), [x, y, z]);

  return (p) => {
    return vec4.transformMat4(p, p, scaleM);
  };
};

export const getRotate = (axs, r) => {
  const rotateM = mat4.fromRotation(mat4.create(), r, axs);

  return (p) => {
    return vec4.transformMat4(p, p, rotateM);
  };
};

export const getRotate2 = (r) => {
  const rotateM = mat3.fromRotation(mat3.create(), r);

  return (p) => {
    return vec3.transformMat3(p, p, rotateM);
  };
};

export const getTranslate2 = (x, y) => {
  const translateM = mat3.fromTranslation(mat3.create(), [x, y]);

  return (p) => {
    return vec3.transformMat3(p, p, translateM);
  };
};

export const getScale2 = (x, y) => {
  const scaleM = mat3.fromScaling(mat3.create(), [x, y]);

  return (p) => {
    return vec3.transformMat3(p, p, scaleM);
  };
};

export const getRotateAround2 = ([x, y], r) => {
  const resM = mat3.fromTranslation(mat3.create(), vec3.fromValues(x, y));
  mat3.rotate(resM, resM, r);
  mat3.translate(resM, resM, vec3.fromValues(-x, -y));
  return (p) => vec3.transformMat3(p, p, resM);
};

export const copyV3 = () => (p) => vec3.copy(vec3.create(), p);
export const copyV4 = () => (p) => vec4.copy(vec4.create(), p);
