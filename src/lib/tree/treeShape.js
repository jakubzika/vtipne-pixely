import { v3, v4 } from '../transformations/base';
import * as R from 'ramda';

import { dist, subtract, scale, add, normalize } from 'gl-matrix/vec4';
import { vec4 } from 'gl-matrix';

/*
implementation

need set of points within some boundary

data structures

point P

- set of seed points functor [P]
- set of branches B = [B.p]

*/

export const cubeNoiseGen = (N, rnd) => {
  const r = R.range(1, N);
  const randPoint = () => v4(...R.map(rnd, R.range(0, 3)));

  return R.map(randPoint, r);
};

const branch = {
  pos: v3(0, 0),
  root: v3(0, 0),
  children: [v3(0, 0), v3(0, 0)],
};

export const createBranch = (pos, root = undefined) => ({
  pos,
  root,
  children: [],
});

export const branchPosL = (b) => b.pos;

const nearestNeighbor = (p, points, pAccessor) => {
  const distToP = (k) => dist(p, k);

  // const distances = R.map(R.pipe(pAccessor, distToP), points);
  const distances = points.map((p) => distToP(pAccessor(p)));

  const [nn, distance] = R.reduce(
    R.minBy((pair) => pair[1]),
    [null, Infinity],
    R.zip(points, distances)
  );
  return [nn, distance];
};

const isInRadius = (radius, p1, p2) => R.lte(dist(p1, p2), radius);

const nearestNeighborsByRadius = (p, points, pAccessor, radius) => {
  const nns = points.filter((curP) => isInRadius(radius, p, pAccessor(curP)));
};

const eliminateNearPoints = (
  points,
  pAccess,
  eliminatePoints,
  eliminationRadius
) =>
  R.filter((p) => {
    const nn = nearestNeighbor(p, points, pAccess)[1];
    return nn > eliminationRadius;
  }, eliminatePoints);

const assignAttractionPointsToBranches = (
  attractionPoints,
  branches,
  pAccessor,
  influenceRadius
) => {
  const nullIfOverRadius = ([branch, distance]) =>
    distance < influenceRadius ? [branch, distance] : [null, null];
  const nns = attractionPoints.map(
    R.pipe((p) => nearestNeighbor(p, branches, pAccessor), nullIfOverRadius)
  );
  const tmp = R.filter((a) => a[1][0] !== null, R.zip(attractionPoints, nns));

  // Separate attraction points into groups according to the assigned branch

  // groups[group[attractionPoint, [branch point, distance]]]
  const combined = R.groupWith((a, b) => a[1][0] == b[1][0], tmp);

  const branchesWithPoints = combined.map((group) => ({
    branch: group[0][1][0],
    attractionPoints: group.map((p) => [p[0], p[1][1]]),
  }));

  return branchesWithPoints;
};

const averageDirection = (branchPoint, pAccessor, attractionPointsWithDist) => {
  const normalizedDirs = R.map(([point, dist]) => {
    const direction = subtract(vec4.create(), point, pAccessor(branchPoint));
    const normDirection = scale(direction, direction, 1 / dist);
    normDirection[3] = 0;
    return normDirection;
  }, attractionPointsWithDist);

  const summedDirs = R.reduce(
    (acc, dir) => {
      return add(acc, dir, acc);
    },
    vec4.fromValues(0, 0, 0, 0),
    normalizedDirs
  );

  const direction = normalize(summedDirs, summedDirs);

  return direction;
};

const growBranches = (
  attractionPoints,
  branches,
  pAccessor,
  influenceRadius,
  scaleRatio
) => {
  const branchToAttractionPointsMap = assignAttractionPointsToBranches(
    attractionPoints,
    branches,
    pAccessor,
    influenceRadius
  );

  const newBranches = branchToAttractionPointsMap.map((k) => {
    const dir = averageDirection(k.branch, pAccessor, k.attractionPoints);

    const scaledDir = vec4.scale(dir, dir, scaleRatio);

    const newPos = add(vec4.create(), pAccessor(k.branch), scaledDir);

    const newBranch = createBranch(newPos, k.branch);
    k.branch.children.push(newBranch);
    return newBranch;
  });

  return [...branches, ...newBranches];
};

export const constructTree = (
  initialAttractionPoints,
  initialBranches,
  options
) => {
  const { nIter, eliminationRadius, influenceRadius, scaleRatio } = options;

  const [_, branches] = R.reduce(
    ([attractionPoints, branches], i) => {
      // console.log(i, 'iter', attractionPoints.length, branches);
      const grownBranches = growBranches(
        attractionPoints,
        branches,
        branchPosL,
        influenceRadius,
        scaleRatio
      );
      const eliminatedAttractionPoints = eliminateNearPoints(
        grownBranches,
        branchPosL,
        attractionPoints,
        eliminationRadius
      );

      return [eliminatedAttractionPoints, grownBranches];
    },
    [initialAttractionPoints, initialBranches],
    R.range(1, nIter)
  );
  return branches;
};

export const traverseTree = (node, cb) => {
  node.children.forEach((child) => {
    cb(node, child);
    traverseTree(child, cb);
  });
};

(() => {
  const attractionPoints = [
    v4(1, 0, 0),
    v4(2, 0, 0),
    v4(3, 0, 0),
    v4(4, 0, 0),
    v4(5, 0, 0),
    v4(-80, 0, 0),
  ];
  const initialBranches = [
    createBranch(v4(0, 0, 0)),
    createBranch(v4(4, 0, 0)),
    createBranch(v4(20, 0, 0)),
  ];

  // const grown = growBranches(
  //   attractionPoints,
  //   initialBranches,
  //   branchPosL,
  //   30,
  //   2
  // );
  // console.log('grown', grown);
  // const tree = constructTree(attractionPoints, initialBranches, {
  //   nIter: 40,
  //   eliminationRadius: 10,
  //   influenceRadius: 40,
  //   scaleRatio: 4,
  // });
})();
