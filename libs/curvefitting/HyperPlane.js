const {create, all} = require('mathjs');
const math = create(all, {});

class HyperPlane {
    constructor(dim, coeff) {
        this.coeff = coeff;
        this.dim = dim;
    }

    apply(vars) {
        return math.dot(
            math.concat([0], vars),
            this.coeff);
    }
}

module.exports = HyperPlane;