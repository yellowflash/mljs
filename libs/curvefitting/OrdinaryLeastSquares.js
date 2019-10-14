const math = require('../math');
const HyperPlane = require('./HyperPlane');

class OrdinaryLeastSquares {
    constructor(m, n, yy, Aij, Ti, hasC) {
        this.m = m;
        this.n = n || 0;
        this.hasC = hasC === undefined || hasC;
        this.yy = yy || 0;
        
        const d = this.hasC ? m + 1 : m;
        this.Aij = Aij || math.zeros(d, d);
        this.Ti = Ti || math.zeros(d);
    }

    add(xs, y) {
        const xsz = this.hasC ? math.concat(xs, [1]) : xs;
        return new OrdinaryLeastSquares(
            this.m,
            this.n + 1,
            this.yy + y * y,
            math.map(this.Aij, (a, [k, j]) => a + xsz.get([j]) * xsz.get([k])),
            math.add(math.multiply(y, xsz), this.Ti),
            this.hasC);
    }

    mse(ws) {
        return (this.yy - 
               2 * math.dot(this.Ti, ws) +
               math.sum(math.map(this.Aij, (a, [i, j]) => a * ws.get([i]) * ws.get([j])))) / this.n;
    }

    fit() {
        //TODO: Reverify if everything is correct here.
        const solved = math.flatten(math.lusolve(this.Aij, this.Ti));
        const reducedChiSquare = (this.n / (this.n - this.m)) * this.mse(solved);
        const covariance = math.multiply(reducedChiSquare, math.inv(this.Aij));

        const tvalues = math.map(math.diag(covariance), (a, [i]) => solved.get([i])/ math.sqrt(a));
        
        return {tvalues: tvalues, rsquared: reducedChiSquare, result: new HyperPlane(this.m, this.hasC ? solved : math.concat(solved, [0]))};
    }

    static create(xss, ys, hasC) {
        const [n, m] = xss.size();
        const xssz = hasC === undefined || hasC ? math.concat(xss, math.ones([n, 1])) : xss;
        return new OrdinaryLeastSquares(
            m,
            n,
            math.dot(ys, math.transpose(ys)),
            math.multiply(math.transpose(xssz), xssz),
            math.multiply(ys, xssz),
            hasC);
    }
}

module.exports = OrdinaryLeastSquares;