const {create, all} = require('mathjs');
const math = create(all, {});

class PolynomialCurve {
    constructor(m, as) {
        this.m = m;
        this.as = as;
    }

    apply(x) {
        return math.sum(
                math.map(this.as, (a, [i]) => a * math.pow(x, i)));
    }
}

class PolynomialFit {
    constructor(m, Aij, Ti) {
        this.m = m;
        this.Aij = Aij || math.zeros(m + 1, m + 1);
        this.Ti = Ti || math.zeros(m + 1);
    }

    add(x, y) {
        return new PolynomialFit(
            this.m,
            math.map(this.Aij, (a, [i, j]) => a + math.pow(x, i + j)),
            math.map(this.Ti, (t, [i]) => t + math.pow(x, i) * y))
    }
    
    fit() {
        const solved = math.lusolve(this.Aij, this.Ti);
        return new PolynomialCurve(this.m, math.map(
            math.zeros(this.m + 1), 
            (z, [i]) => math.row(solved, i)));
    }
}

module.exports = PolynomialFit;