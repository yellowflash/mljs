const HyperPlane = require('./HyperPlane');
const math = require('../math');

class OrdinaryLeastSquares {
    constructor(m, Aij, Ti) {
        this.m = m;
        this.Aij = Aij || math.zeros(m + 1, m + 1);
        this.Ti = Ti || math.zeros(m + 1);
    }

    add(xs, y) {
        const xsz = math.concat([1], xs);
        return new OrdinaryLeastSquares(
            this.m,
            math.map(this.Aij, (a, [k, j]) => a + xsz.get([j]) * xsz.get([k])),
            math.map(this.Ti, (t, [k]) => t + y * xsz.get([k]))
        )
    }

    fit() {
        const solved = math.lusolve(this.Aij, this.Ti);
        return new HyperPlane(this.m, math.flatten(solved));
    }
}

module.exports = OrdinaryLeastSquares;