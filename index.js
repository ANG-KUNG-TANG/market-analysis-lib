import StockSense from './src/stockSense.js';
export default StockSense;

export { fetchHistory } from './src/providers/fetcher.js';

export {
    getMaxPrice,
    getMinPrice,
    getPercentageGrowth,
    getPriceEvaluation
} from './src/analyzers/analyzer.js';

export { analyzeHealth }    from './src/analyzers/health.js';
export { analyzeGrowth }    from './src/analyzers/growth.js';
export { analyzeValuation } from './src/analyzers/valuation.js';
export { analyzeRisk }      from './src/analyzers/risk.js';
export { explainMetric }    from './src/explainers/index.js';
export { analyze }          from './src/recommendation/index.js';