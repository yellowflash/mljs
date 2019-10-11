const assert = require('assert');
const chai = require('chai');
const math = require('../libs/math');

const should = chai.should();

describe('lagmat', () => {
    it("should produce lagged matrix for a given vector", () => {
        const expected = math.matrix([[1, 2], [2, 3], [3, 4], [4, 5]]);
        const actual = math.lagmat(2, math.matrix(math.range(1, 5, true)))

        math.deepEqual(expected, actual).should.equal(true);
    })});

describe('diffVector', () => {
    it("should produce a diff vector of size n - 1 for a n sized vector", () => {
        const expected = math.matrix([1, 2, 3, 4, 5, 4]);
        const actual = math.diffVector(math.matrix([10, 11, 13, 16, 20, 25, 29]));

        math.deepEqual(expected, actual).should.equal(true);
    })});