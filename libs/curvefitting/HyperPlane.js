const math = require('../math.js');

class HyperPlane {
    constructor(dim, coeff) {
        this.coeff = coeff;
        this.dim = dim;
    }

    apply(vars) {
        return math.dot(
            math.concat([1], vars),
            this.coeff);
    }
}

module.exports = HyperPlane;