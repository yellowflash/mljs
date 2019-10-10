const math = require('../math');
const HyperPlane = require('./HyperPlane');

class OrdinaryLeastSquares {
    constructor(m, n, yy, Aij, Ti) {
        this.m = m;
        this.n = n || 0;
        this.yy = yy || 0;
        this.Aij = Aij || math.zeros(m + 1, m + 1);
        this.Ti = Ti || math.zeros(m + 1);
    }

    add(xs, y) {
        const xsz = math.concat([1], xs);
        return new OrdinaryLeastSquares(
            this.m,
            this.n + 1,
            this.yy + y * y,
            math.map(this.Aij, (a, [k, j]) => a + xsz.get([j]) * xsz.get([k])),
            math.map(this.Ti, (t, [k]) => t + y * xsz.get([k])));
    }

    mse(ws) {
        return this.yy - 
               2 * math.sum(math.map(this.Ti, (a, [i]) => a * ws.get([i]))) +
               math.sum(math.map(this.Aij, (a, [i, j]) => a * ws.get([i]) * ws.get([j])));
    }

    fit() {
        //TODO: Reverify if everything is correct here.
        const solved = math.flatten(math.lusolve(this.Aij, this.Ti));
        const reducedChiSquare = ((this.n - this.m) / this.n) * this.mse(solved);
        const covariance = math.multiply(reducedChiSquare, math.inv(this.Aij));
        const tvalues = math.map(math.diag(covariance), (a, [i]) => math.sqrt(math.abs(solved.get([i])/ a)));
        return {tvalues: tvalues, result: new HyperPlane(this.m, solved)};
    }

    static create(xss, ys) {
        const [n, m] = xss.size();
        const xssz = math.concat(math.ones([n, 1]), xss)

        return new OrdinaryLeastSquares(
            m,
            n,
            math.dot(ys, math.transpose(ys)),
            math.multiply(math.transpose(xssz), xssz),
            math.multiply(ys, xssz));
    }
}

module.exports = OrdinaryLeastSquares;