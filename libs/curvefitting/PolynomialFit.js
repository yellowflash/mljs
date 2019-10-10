const math = require('../math');
const Polynomial = require('./Polynomial')
const OrdinaryLeastSquares = require('./OrdinaryLeastSquares')

class PolynomialFit {
    constructor(m, leastSquares) {
        this.m = m;
        this.leastSquares = leastSquares || new OrdinaryLeastSquares(m);
    }

    add(x, y) {
        return new PolynomialFit(
            this.m, 
            this.leastSquares.add(
                math.map(
                    math.range(1, this.m, true), 
                    (k) => math.pow(x, k)), y));
    }
    
    fit() {
        const {tvalues, result} = this.leastSquares.fit()
        return { tvalues: tvalues, result: new Polynomial(this.m, result) };
    }

    static create(m, xs, ys) {
        const [n] = xs.size()
        return new PolynomialFit(
            m,
            OrdinaryLeastSquares.create(
                math.map(
                    math.matrix(math.zeros([n, m])), 
                    (x, [i, j]) => math.pow(xs.get([i]), j + 1)),
                ys));
    }
}

module.exports = PolynomialFit;