const assert = require('assert');
const chai = require('chai');
const PolynomialFit = require("../../libs/curvefitting/PolynomialFit");

const should = chai.should();

describe('PolynomialFit', () => {
    const poly = (x) => x*x + 2
    it('should fit a parabola', () => {
        new PolynomialFit(2)
            .add(1, poly(1))
            .add(2, poly(2))
            .add(3, poly(3))
            .fit()
            .result
            .apply(4).should.be.closeTo(poly(4), 0.0001);
    });
    it('should fit a parabola with noise', () => {
        new PolynomialFit(2)
            .add(1, poly(1) - 0.5)
            .add(2, poly(2) + 1)
            .add(3, poly(3) - 1)
            .add(4, poly(4))
            .add(5, poly(5) - 0.25)
            .fit()
            .result
            .apply(6).should.be.closeTo(poly(6), 1.0)
    })});
