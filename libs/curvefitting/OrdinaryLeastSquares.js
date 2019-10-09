const HyperPlane = require('HyperPlane');
const {create, all} = require('mathjs');
const math = create(all, {});

class OrdinaryLeastSquares {
    constructor(m, Aij, Ti) {
        this.m = m;
        this.Aij = Aij || math.zeros(m + 1, m + 1);
        this.Ti = Ti || math.zeros(m + 1);
    }

    add(xs, y) {
        const xsz = math.concat([0], xs);

        return new OrdinaryLeastSquares(
            this.m,
            math.map(this.Aij, (a, [k, j]) => a + x.column(j) * x.column(k)),
            math.map(this.Ti, (t, k) => t + y * x.column(k))
        )
    }

    fit() {
        const solved = math.lusolve(this.Aij, this.Ti);
        
        // We should ideally return solved, but that's a single column matrix and 
        // there is no direct way to convert to vector.
        return new HyperPlane(math.map(
            math.zeros(this.m + 1), 
            (z, [i]) => math.row(solved, i)))
    }
}

module.exports = OrdinaryLeastSquares;