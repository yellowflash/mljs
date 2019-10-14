const math = require('../math');
const OrdinaryLeastSquares = require('../curvefitting/OrdinaryLeastSquares')

// We could do an incremental version of this too, lag times linear models 
// But lets get a simpler one shot model first.
class AugumentedDickeyFuller {
    constructor(ts, hasC, maxlag) {
        [this.m] = ts.size();
        this.ts = ts;
        this.hasC = hasC === undefined || hasC;
        this.maxlag = maxlag || math.min(this.m, math.ceil(12 * math.pow(this.m / 100.0, 1 / 4)));
    }

    fit() {
        const {tvalue, lag} = this.bestlag();

        const pvalue = AugumentedDickeyFuller.mackinnonP(tvalue, this.hasC);

        return {tvalue, lag, pvalue};
    }

    regressForAll(tdiff, lag) {
        // Python version does one more OLS here with all the data (lag..m) instead of (maxlag..m)
        // but weirdly they take t-value of another co-efficient not the first order co-efficient. 
        // We should ideally take tvalues.get([1]) according to wikipedia but tvalues.get([lag]) according to statsmodels.
        // For now we agree with what statsmodels says.
        const nob = (this.m - lag - 1);
        const ys = math.splice(tdiff, lag, this.m - 1);
        
        const lagged = math.lagmat(lag, math.splice(tdiff, 0, this.m - 2));
        const xss = math.concat(lagged, math.reshape(math.splice(this.ts, lag, this.m - 1), [nob, 1]));

        const {tvalues, result} = OrdinaryLeastSquares.create(xss, ys, this.hasC).fit();
        return {lag: lag, tvalue: tvalues.get([lag])}
    }

    //FIXME: This code is completely unreadable.
    bestlag() {
        const tdiff = math.diffVector(this.ts);
        const nob = (this.m - this.maxlag - 1);

        const ys = math.splice(tdiff, this.maxlag, this.m - 1);
        const tp = math.reshape(math.splice(this.ts, this.maxlag, this.m - 1), [nob, 1]);
        
        const stop = 1.6448536269514722;

        for(var lag = this.maxlag; lag >= 2; lag--) {
            const lagged = math.lagmat(lag, math.splice(tdiff, this.maxlag - lag, this.m - 2));
            const xss = math.concat(lagged, tp);
            const {tvalues, rsquared, result} = OrdinaryLeastSquares.create(xss, ys, this.hasC).fit();
            
            const tvalue = tvalues.get([0]);
            if(stop <= math.abs(tvalue)) {
                return this.regressForAll(tdiff, lag);
            }
        }
        return {lag: 2, tvalue: 0};
    }


    // Right now handling just the constant only case.
    static mackinnonP(x, hasC){
        const max = hasC ? 2.74 : 0.92; 
        const min = hasC ? -18.83 : -18.86;

        if(x >= max) {
            return 1.0;
        }
        if(x <= min) {
            return 0.0;
        }
        const tau = hasC ? x <= -1.61 ? 2.1659 + 1.4412 * x + 3.8269 * 1e-2 * x * x  : 
                                        1.7339 + 9.3202 * 1e-1 * x + -1.2745 * 1e-1 * x * x + -1.0368 * 1e-2 * x * x * x :
                           x <= -2.62 ? 2.9200 + 1.5012 * x + 3.9796 * 1e-2 * x * x :
                                        1.5578 + 8.5580 * 1e-1 * x + -2.0830 * 1e-1 * x * x + -3.3549 * 1e-2 * x * x * x;

        return math.cumulativeProbability(tau);
    }


}

module.exports = AugumentedDickeyFuller;