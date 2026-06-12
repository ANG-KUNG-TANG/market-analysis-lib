export {fetchHistory} from './src/fetcher.js';

export{
    getMaxPrice,
    getMinPrice,
    getPercentageGrowth,
    getPriceEvaluation
} from './src/analyzer.js'

export { analyzeHealth} from './src/analyzers/health.js';
export { analyzeGrowth} from './src/analyzers/growth.js';
export { analyzeRisk} from './src/analyzers/risk.js';
export { explainMetric} from './src/explainers/index.js'
export { analyze } from './src/recommendation/index.js'