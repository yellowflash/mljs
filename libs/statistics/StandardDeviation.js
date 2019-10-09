const math = require('../math');

class StandardDeviation {
    constructor(n, xx, x) {
        this.n = n || 0;
        this.xx = xx || 0;
        this.x = x || 0;
    }

    add(x) {
        return new StandardDeviation(
            this.n + 1,
            this.xx + x * x,
            this.x + x);
    }

    fit() {
        const mean = this.x / this.n;
        return math.sqrt((this.xx + 2 * this.x * mean + mean * mean) / this.n);
    }
}

module.exports = StandardDeviation;