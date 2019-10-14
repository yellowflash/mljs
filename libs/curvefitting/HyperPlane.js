const math = require('../math');

class HyperPlane {
    constructor(dim, coeff) {
        this.coeff = coeff;
        this.dim = dim;
    }

    apply(vars) {
        return math.multiply(
            math.concat([1], vars),
            this.coeff);
    }
}

module.exports = HyperPlane;