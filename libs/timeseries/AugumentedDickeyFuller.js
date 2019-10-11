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

    bestlag() {
        const stop = 1.6448536269514722;

        const tdiff = math.diffVector(this.ts);
        const nob = (this.m - this.maxlag - 1);

        const ys = math.splice(this.ts, this.maxlag + 1, this.m);
        const tp = math.reshape(math.splice(this.ts, this.maxlag, this.m - 1), [nob, 1])
        
        var bestlag = -1;
        var besttvalue = 1.6448536269514722;

        for(var lag = this.maxlag; lag >= 2; lag--) {
            const lagged = math.lagmat(lag, math.splice(tdiff, this.maxlag - lag, this.m - 2));
            const xss = math.concat(lagged, tp);
            const {tvalues, result} = OrdinaryLeastSquares.create(xss, ys).fit();
            
            const tvalue = tvalues.get([1]);
            if(math.abs(besttvalue) < math.abs(tvalue)) {
                besttvalue = tvalue;
                bestlag = lag;
            }
        }
        return {lag: bestlag, tvalue: besttvalue}
    }
}

module.exports = AugumentedDickeyFuller;