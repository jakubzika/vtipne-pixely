import { srgb } from '@thi.ng/color';
import alea from 'alea';
import { setBackground } from '../lib/color';
import { combineTransforms, fmap, v4 } from '../lib/transformations/base';
import { getScale } from '../lib/transformations/transforms';
import {
  branchPosL,
  constructTree,
  createBranch,
  cubeNoiseGen,
  traverseTree,
} from '../lib/tree/treeShape';

// SPACE COLONIZATION

export default () => {
  //prepare
  const rnd = alea('hafbgap');
  const noise = fmap(cubeNoiseGen(2000, rnd), ([x, y, z, w]) => v4(x, y, 0, 0));

  const scaledNoise = fmap(noise, getScale(20, 20, 1));
  // debugger;

  const attractionPoints = [
    // v4(1, 0, 0),
    // v4(2, 0, 0),
    // v4(30, 90, 0),
    // v4(4, 0, 0),
    v4(400, 10, 0),
    v4(10, 400, 0),
  ];
  const initialBranches = [
    createBranch(v4(10, 10, 0)),
    // createBranch(v4(90, 90, 0)),
    // createBranch(v4(10, 10, 0)),
    // createBranch(v4(100, 10, 0)),
    // createBranch(v4(100, 0, 0, 0)),
    // createBranch(v4(200, 0, 0, 0)),
  ];

  const tree = constructTree(scaledNoise, initialBranches, {
    nIter: 10,
    eliminationRadius: 8,
    influenceRadius: 50,
    scaleRatio: 1,
  });
  const treePoints = tree.map((t) => t.pos);
  console.log(treePoints);
  frameRate(1);
  strokeWeight(1);
  stroke(100);
  fill(100);

  return () => {
    setBackground(srgb('#e4dfdf'));

    scaledNoise.forEach(([x, y, z, w]) => {
      fill(255, 0, 0);
      ellipse(x * 10, y * 10, 2);
    });

    // treePoints.forEach(([x, y, z, w]) => {
    //   // debugger;
    //   ellipse(x, y, 2);
    // });

    traverseTree(initialBranches[0], (parent, children) => {
      // debugger;
      console.log('---', parent, children);
      const [ax, ay, az, aw] = branchPosL(parent);
      const [bx, by, bz, bw] = branchPosL(children);

      line(ax * 30, ay * 30, bx * 30, by * 30);
      console.log('xxx');
    });

    // line(200, 0, 200, 600);

    // console.log('fu');

    // stroke(10);
    // fill(100, 0, 0);

    // draw
  };
};
