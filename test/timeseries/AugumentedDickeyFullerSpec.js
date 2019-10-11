const assert = require('assert');
const chai = require('chai');
const math = require('../../libs/math');
const ADF = require("../../libs/timeseries/AugumentedDickeyFuller");
const testdata = require('./testdata');

const should = chai.should();

describe("AugumentedDickeyFuller", () => {
    it("should say stationary series as stationary with high confidence", () => {
        const pvalue = new ADF(math.matrix(testdata.stationary))
                            .fit().pvalue;
        pvalue.should.be.closeTo(0.05, 0.005);
    })});