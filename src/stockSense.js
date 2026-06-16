import { analyzeHealth }                                          from './analyzers/health.js';
import { analyzeGrowth }                                          from './analyzers/growth.js';
import { analyzeValuation }                                       from './analyzers/valuation.js';
import { analyzeRisk }                                            from './analyzers/risk.js';
import { getPriceEvaluation, getMaxPrice, getMinPrice,
         getPercentageGrowth }                                    from './analyzers/analyzer.js';
import { explainMetric }                                          from './explainers/index.js';
import { analyze }                                                from './recommendation/index.js';
import { fetchHistory }                                           from './providers/fetcher.js';

export default class StockSense {
    /**
     * @param {Object} data
     * @param {string} data.symbol
     * @param {Object} [data.fundamentals]
     * @param {Array}  [data.priceHistory]
     */
    constructor({ symbol, fundamentals = {}, priceHistory = [] } = {}) {
        if (!symbol) throw new Error("StockSense: symbol is required");
        this.symbol       = symbol;
        this.fundamentals = fundamentals;
        this.priceHistory = priceHistory;
    }

    /**
     * Async factory — fetches live price history and returns a StockSense instance.
     * @param {string} symbol
     * @param {string} provider - 'coingecko' | 'yahoo'
     * @returns {Promise<StockSense>}
     *
     * @example
     * const sense = await StockSense.fetch('AAPL', 'yahoo');
     */
    static async fetch(symbol, provider = 'yahoo') {
        const priceHistory = await fetchHistory(symbol, provider);
        return new StockSense({ symbol, priceHistory });
    }

    // ─── Fundamental Analyzers ────────────────────────────────────────────────

    /** @returns {{ score, status, explanation, metrics }} */
    analyzeHealth()    { return analyzeHealth(this.fundamentals); }

    /** @returns {{ score, growth, explanation, metrics }} */
    analyzeGrowth()    { return analyzeGrowth(this.fundamentals); }

    /** @returns {{ score, valuation, explanation, metrics }} */
    analyzeValuation() { return analyzeValuation(this.fundamentals); }

    /** @returns {{ score, risk, explanation, metrics }} */
    analyzeRisk()      { return analyzeRisk(this.fundamentals); }

    // ─── Full Report ──────────────────────────────────────────────────────────

    /**
     * Runs all analyzers and returns a combined report.
     * @returns {{ overallScore, recommendation, confidence, strengths, concerns, breakdown }}
     *
     * @example
     * const report = sense.analyze();
     * console.log(report.recommendation); // "Worth Researching"
     */
    analyze() { return analyze(this.fundamentals); }

    // ─── Price History Analyzers ──────────────────────────────────────────────

    /** @returns {{ date, price }} */
    getMaxPrice()          { return getMaxPrice(this.priceHistory); }

    /** @returns {{ date, price }} */
    getMinPrice()          { return getMinPrice(this.priceHistory); }

    /** @returns {number} percentage */
    getPercentageGrowth()  { return getPercentageGrowth(this.priceHistory); }

    /** @returns {{ mode, action, description, currentPrice, min30Day, max30Day }} */
    getPriceEvaluation()   { return getPriceEvaluation(this.priceHistory); }

    // ─── Explainer ────────────────────────────────────────────────────────────

    /**
     * Explains a financial metric in plain English.
     * @param {string} metric - 'PE' | 'PB' | 'ROE' | 'ROA' | 'DE' | 'BETA' | 'CR' | 'PEG'
     * @param {number} value
     * @returns {{ metric, title, explanation, interpretation }}
     *
     * @example
     * sense.explain('PE', 32);
     * // { title: "Price-to-Earnings Ratio", interpretation: "Slightly expensive", ... }
     */
    explain(metric, value) { return explainMetric(metric, value); }
}