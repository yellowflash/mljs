const math = require('../math');
const HyperPlane = require('./HyperPlane')

class Polynomial {
    constructor(dim, hyperPlane) {
        this.hyperPlane = hyperPlane || new HyperPlane(dim);
    }

    apply(x) {
        return this.hyperPlane.apply(
            math.map(
                math.range(1, this.hyperPlane.dim, true), 
                (k) => math.pow(x, k)));
    }
}

module.exports = Polynomial;