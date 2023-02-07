import '../css/style.css';
import { sketch } from 'p5js-wrapper';
import {
  getCamera,
  getOrthographicProjection,
  getPerspectiveProjection,
  getViewport,
} from './transformations/transforms';
import { combineTransforms as combineTransformations } from './transformations/base';
import { WIDTH, HEIGHT } from './const';
import { drawBlurred, gridSketch } from './shape';
import { testColors } from './color';

let sliderA, sliderB, sliderC, sliderR;
let grid;

const cameraToClip = getPerspectiveProjection();
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
  // blur
  blurSteps: 0,
  blurStep: 0,
  blur: 0,
  // --
  transformations: {
    worldToClip,
    clipToScreen,
    worldToScreen,
  },
};

let state;

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

sketch.setup = () => {
  createCanvas(WIDTH, HEIGHT);
  drawOnce();

  sliderA = createSlider(-10, 10, 0, 0.1);
  sliderA.position(10, HEIGHT + 10);

  sliderB = createSlider(-10, 10, 0, 0.1);
  sliderB.position(10, HEIGHT + 40);

  sliderC = createSlider(-10, 10, 0, 0.1);
  sliderC.position(10, HEIGHT + 70);

  sliderR = createSlider(-10, 10, -0.77, 0.1);
  sliderR.position(10, HEIGHT + 100);

  state = updateState();

  grid = gridSketch(state);
  // frameRate(5);
};

sketch.draw = () => {
  state = updateState(state);
  background(245, 239, 237);
  fill(255);

  drawBlurred(grid, state, 24);
};
