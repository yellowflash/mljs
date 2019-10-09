const assert = require('assert');
const chai = require('chai');
const PolynomialFit = require("../../libs/curvefitting/PolynomialFit");

const should = chai.should();

describe('PolynomialFit', () => 
    it('should fit a parabola', () => {
        const poly = (x) => x*x + 2
        new PolynomialFit(2)
            .add(1, poly(1))
            .add(2, poly(2))
            .add(3, poly(3))
            .fit()
            .apply(4).should.be.closeTo(poly(4), 0.0001);
    }));
