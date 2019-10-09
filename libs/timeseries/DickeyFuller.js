const OrdinaryLeastSquares = require('../curvefitting/OrdinaryLeastSquares')

class DickeyFuller {
    constructor(n, yprev, linearmodel, drift, trend) {
        this.n = n || 0;
        this.yprev = yprev || 0;
        this.linearmodel = linearmodel || new OrdinaryLeastSquares(1);
        this.drift = drift || 0;
        this.trend = trend || 0;
    }

    add(y) {
        if(n == 0) return new DickeyFuller(
            1, 
            y, 
            this.linearmodel, 
            this.drift, 
            this.trend);

        else new DickeyFuller(
            this.n + 1, 
            y, 
            this.linearmodel.add([this.yprev], y - this.yprev - this.drift - this.trend * this.yprev), 
            this.drift, 
            this.trend);
    }

    fit() {
        return this.linearmodel.fit().coeff.get([1]) == 0;
    }
}