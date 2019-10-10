const {create, all} = require('mathjs');
const math = create(all, {})


// TODO: Don't corrupt mathjs so much just move these to some other place.
math.lagmat = (lag, vector) => {
    const [m] = vector.size();
    if(m < lag) throw "Lag cannot be greater than m";
    const result = [];
    for(i = 0; i <= m - lag; i ++) {
        const current = [];
        for(j = i; j < i + lag; j++) {
            current[j - i] = (vector.get([j]));
        }
        result[i] = current;
    }
    return math.matrix(result);
}

// Right now handling just the constant only case.
math.mackinnonP = (stat) => {
    if(stat >= 2.74) {
        return 1.0;
    }
    if(stat <= -18.83) {
        return 0.0;
    }
    const tauCoeff = stat <= -1.61 ? [2.1659, 1.4412, 3.8269 * 1e-2] : [1.7339, 9.3202, -1.2745, -1.0368];
    return math.cumulativeProbability(math.sum(math.multiply(tauCoeff, stat)));
}

math.cumulativeProbability = (x, mean, sd) => {
    const m = mean || 0;
    const s = sd || 1;
    const dev = x - mean;
    if (math.abs(dev) > 40 * s) {
        return dev < 0 ? 0.0 : 1.0;
    } 
    return 0.5 * math.erfc(-dev / (s * math.sqrt(2)));
}

math.erfc = (x) => 1 - math.erf(x)

module.exports = math;