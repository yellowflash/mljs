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
        return new Polynomial(this.m, this.leastSquares.fit());
    }
}

module.exports = PolynomialFit;