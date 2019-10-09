const {create, all} = require('mathjs');
const math = create(all, {})

math.at = (m, i) => math.subset(m, math.index(i));
module.exports = math;