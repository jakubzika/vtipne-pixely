import '../css/style.css';
import { sketch } from 'p5js-wrapper';
import {
  getCamera,
  getOrthographicProjection,
  getPerspectiveProjection,
  getViewport,
} from './lib/transformations/transforms';
import { combineTransforms as combineTransformations } from './lib/transformations/base';
import { WIDTH, HEIGHT } from './const';
import { testColors } from './lib/color';
import sketches from './sketches/index';
import { isPromise } from './util';

let sliderA, sliderB, sliderC, sliderR;

const orthoCameraToClip = getOrthographicProjection();
const worldToCamera = getCamera([-10, -10, -10], [0, 0, 0], [0, 1, 0]);
const clipToScreen = getViewport();
const worldToClip = combineTransformations(worldToCamera, orthoCameraToClip);
const worldToScreen = combineTransformations(
  worldToCamera,
  orthoCameraToClip,
  clipToScreen
);

const initialState = {
  slider3: [0, 0, 0],
  slider1: 0,
  time: 0,
  delta: 0,
  blurSteps: 0,
  blurStep: 0,
  blur: 1,
  // --
  transformations: {
    worldToClip,
    clipToScreen,
    worldToScreen,
  },
};

let state;
let currentSketch;

const updateState = (oldState = initialState) => ({
  ...oldState,
  slider3: [sliderA.value(), sliderB.value(), sliderC.value()],
  slider1: sliderR.value(),
  time: deltaTime + oldState.time,
  delta: deltaTime,
});

const drawOnce = () => {
  background(0, 0, 0);
  noStroke();
  rectMode(CENTER);
  testColors();
};

const parseSearch = (s) => {
  s = s.slice(1).split('&');
  const keyvals = s.map((x) => x.split('='));
  const res = keyvals.reduce((res, [key, val]) => ({ ...res, [key]: val }), {});
  return res;
};

// todo improve
let setupPromiseResolve = undefined;
const setupPromise = new Promise((res) => {
  setupPromiseResolve = res;
});

sketch.setup = async () => {
  createCanvas(WIDTH, HEIGHT);

  drawOnce();
  {
    sliderA = createSlider(0, 100, 0, 1);
    sliderA.position(10, HEIGHT + 10);

    sliderB = createSlider(0, 100, 20, 1);
    sliderB.position(10, HEIGHT + 40);

    sliderC = createSlider(-10, 10, 0, 0.1);
    sliderC.position(10, HEIGHT + 70);

    sliderR = createSlider(-10, 10, -0.77, 0.1);
    sliderR.position(10, HEIGHT + 100);
  }

  state = updateState();
  const search = parseSearch(window.location.search);
  if ('sketch' in search && search.sketch in sketches) {
    currentSketch = sketches[search.sketch](state);
    if (isPromise(currentSketch)) {
      currentSketch = await currentSketch;
    }
  } else {
    currentSketch = await sketches.sketch06(state);
  }
  setupPromiseResolve();
};

sketch.draw = async () => {
  // await setupPromise;
  state = updateState(state);
  // try {
  currentSketch(state);
  // } catch (e) {
  //   console.log('caught a nasty bug', e);
  //   return;
  // }
};
