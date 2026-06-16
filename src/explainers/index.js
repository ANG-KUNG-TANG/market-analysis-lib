const METRICS = {
    PE: {
        title: "Price-to-Earnings Ratio",
        describe: (v) => `Investors pay $${v} for every $1 the company earns annually.`,
        interpret: (v) => v <= 15 ? "Cheap" : v <= 25 ? "Fair" : v <= 35 ? "Slightly expensive" : "Expensive"
    },
    PB: {
        title: "Price-to-Book Ratio",
        describe: (v) => `The stock trades at ${v}x the company's book value.`,
        interpret: (v) => v <= 1 ? "Undervalued" : v <= 3 ? "Fair" : "Overvalued"
    },
    PEG: {
        title: "Price/Earnings-to-Growth Ratio",
        describe: (v) => `A PEG of ${v} — below 1 is typically considered undervalued relative to growth.`,
        interpret: (v) => v <= 1 ? "Undervalued" : v <= 2 ? "Fair" : "Overpriced for its growth"
    },
    ROE: {
        title: "Return on Equity",
        describe: (v) => `The company generates ${v}% return on every dollar shareholders have invested.`,
        interpret: (v) => v >= 20 ? "Excellent" : v >= 12 ? "Good" : v >= 5 ? "Average" : "Weak"
    },
    ROA: {
        title: "Return on Assets",
        describe: (v) => `The company earns ${v}% return on its total assets.`,
        interpret: (v) => v >= 10 ? "Excellent" : v >= 5 ? "Good" : v >= 2 ? "Average" : "Weak"
    },
    DE: {
        title: "Debt-to-Equity Ratio",
        describe: (v) => `The company carries $${v} of debt for every $1 of equity.`,
        interpret: (v) => v <= 0.3 ? "Very safe" : v <= 1 ? "Manageable" : v <= 2 ? "Elevated" : "Highly leveraged"
    },
    BETA: {
        title: "Beta",
        describe: (v) => `Beta of ${v} means the stock moves ${v}x as much as the market on average.`,
        interpret: (v) => v <= 0.5 ? "Very stable" : v <= 1 ? "Stable" : v <= 1.5 ? "Moderate risk" : "High risk"
    },
    CR: {
        title: "Current Ratio",
        describe: (v) => `The company has $${v} in short-term assets for every $1 of short-term debt.`,
        interpret: (v) => v >= 2 ? "Very liquid" : v >= 1 ? "Healthy" : "May struggle with short-term bills"
    }
};

/**
 * Explains a financial metric in plain English.
 * @param {string} metric - e.g. 'PE', 'ROE', 'BETA'
 * @param {number} value
 * @returns {{ metric, title, explanation, interpretation }}
 */
export function explainMetric(metric, value) {
    const key  = metric.toUpperCase();
    const def  = METRICS[key];

    if (!def) throw new Error(`explainMetric: unknown metric "${metric}". Supported: ${Object.keys(METRICS).join(', ')}`);
    if (value == null) throw new Error(`explainMetric: no value provided for "${metric}"`);

    return {
        metric:         key,
        title:          def.title,
        explanation:    def.describe(value),
        interpretation: def.interpret(value)
    };
}