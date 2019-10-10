const math = require('../math');
const OrdinaryLeastSquares = require('../curvefitting/OrdinaryLeastSquares')

// We could do an incremental version of this too, lag times linear models 
// But lets get a simpler one shot model first.
class AugumentedDickeyFuller {
    constructor(ts, maxlag) {
        [this.m] = ts.size();
        this.ts = ts;
        this.maxlag = maxlag || math.min(m, math.ceil(12 * math.pow(m / 100.0, 1 / 4)));
    }

    fit() {
        const {result, tvalue, lag} = this.bestlag();
        return math.mackinnonP(tvalue);
    }

    bestlag() {
        const stop = 1.6448536269514722;
        for(lag = this.maxlag; lag >= 2; i --) {
            const {tvalues, result} = OrdinaryLeastSquares
                .create(math.lagmat(lag, xdiff), ts.get([this.m - 1]))
                .fit();
            const current = math.abs(tvalues.get([m]));

            if(current >= stop || lag == this.maxlag) {
                return {result, tvalue, lag}
            }
        }
    }
}