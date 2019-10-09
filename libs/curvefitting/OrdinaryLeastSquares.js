const HyperPlane = require('./HyperPlane');
const math = require('../math');

class MeanSquareError {
    constructor(m, yy, yx, xx) {
        this.m = m;
        this.yy = yy || 0;
        this.yx = yx || math.zeros(m + 1);
        this.xx = xx || math.zeros(m + 1, m + 1);
    }

    add(xs, y) {
        // xx is basically Aij of the LeastSquares, We should probably not compute that twice.
        return new MeanSquareError(
            this.m,
            this.yy + y * y,
            math.map(this.yx, (a, [i]) => a + y * xs.get([i])),
            math.map(this.xx, (a, [i, j]) => a + xs.get([i]) * xs.get([j])));
    }

    fit(ws) {
        return this.yy - 
               2 * math.sum(math.map(this.yx, (a, [i]) => a * ws.get([i]))) +
               math.sum(math.map(this.xx, (a, [i, j]) => a * ws.get([i]) * ws.get([j])));
    }
}

class OrdinaryLeastSquares {
    constructor(m, n, Aij, Ti, errors) {
        this.m = m;
        this.n = n || 0;
        this.Aij = Aij || math.zeros(m + 1, m + 1);
        this.Ti = Ti || math.zeros(m + 1);
        this.errors = errors || new MeanSquareError(m);
    }

    add(xs, y) {
        const xsz = math.concat([1], xs);
        return new OrdinaryLeastSquares(
            this.m,
            this.n + 1,
            math.map(this.Aij, (a, [k, j]) => a + xsz.get([j]) * xsz.get([k])),
            math.map(this.Ti, (t, [k]) => t + y * xsz.get([k])),
            this.errors.add(xsz, y));
    }

    fit() {
        const solved = math.flatten(math.lusolve(this.Aij, this.Ti));
        const reducedChiSquare = ((this.n - this.m) / this.n) * this.errors.fit(solved);
        const covariance = math.multiply(reducedChiSquare, math.inv(this.Aij));
        const tvalues = math.map(math.diag(covariance), (a, [i]) => math.sqrt(solved.get([i])/ a));
        return {tvalues: tvalues, result: new HyperPlane(this.m, solved)};
    }
}

module.exports = OrdinaryLeastSquares;