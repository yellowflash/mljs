const math = require('../math');
const OrdinaryLeastSquares = require('../curvefitting/OrdinaryLeastSquares')

// We could do an incremental version of this too, lag times linear models 
// But lets get a simpler one shot model first.
class AugumentedDickeyFuller {
    constructor(ts, maxlag) {
        [this.m] = ts.size();
        this.ts = ts;
        this.maxlag = maxlag || math.min(this.m, math.ceil(12 * math.pow(this.m / 100.0, 1 / 4)));
    }

    fit() {
        const {tvalue, lag} = this.bestlag();

        const pvalue = math.mackinnonP(tvalue);

        return {tvalue, lag, pvalue};
    }

    regressForAll(tdiff, lag) {
        // Python version does one more OLS here with all the data (lag..m) instead of (maxlag..m)
        // but weirdly they take t-value of another co-efficient not the first order co-efficient. 
        // We should ideally take tvalues.get([1]) according to wikipedia but tvalues.get([lag + 1]) according to statsmodels.
        // For now we agree with what statsmodels says.
        const nob = (this.m - lag - 1);
        const ys = math.splice(tdiff, lag, this.m - 1);
        
        const lagged = math.lagmat(lag, math.splice(tdiff, 0, this.m - 2));
        const xss = math.concat(lagged, math.reshape(math.splice(this.ts, lag, this.m - 1), [nob, 1]));

        const {tvalues, result} = OrdinaryLeastSquares.create(xss, ys).fit();
        return {lag: lag, tvalue: tvalues.get([lag + 1])}
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
            const {tvalues, rsquared} = OrdinaryLeastSquares.create(xss, ys).fit();
            
            const tvalue = tvalues.get([1]);
            if(stop <= math.abs(tvalue)) {
                return this.regressForAll(tdiff, lag);
            }
        }
        return {lag: 2, tvalue: 0};
    }
}

module.exports = AugumentedDickeyFuller;