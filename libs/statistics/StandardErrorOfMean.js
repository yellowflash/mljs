const math = require('../math');
const StandardDeviation = require('./StandardDeviation');

class StandardErrorOfMean {
    constructor(standardDeviation) {
        this.standardDeviation = standardDeviation || new StandardDeviation();
    }

    add(x) {
        return new StandarErrorOfMean(this.standardDeviation.add(x));
    }

    fit() {
        const sd = this.standardDeviation.fit();
        return sd / math.sqrt(this.standardDeviation.n);
    }
}

module.exports = StandardErrorOfMean;