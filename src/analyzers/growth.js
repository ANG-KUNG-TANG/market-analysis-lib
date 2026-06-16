/**
 * Analyzes year-over-year growth from fundamentals.
 * @param {Object} fundamentals
 * @returns {{ score: number, growth: string, explanation: string, metrics: Object }}
 */
export function analyzeGrowth(fundamentals) {
    if (!fundamentals) throw new Error("analyzeGrowth: no fundamentals provided");

    const { revenue, prevRevenue, netIncome, prevNetIncome,
            freeCashFlow, prevFreeCashFlow } = fundamentals;

    const revenueGrowth  = pctChange(prevRevenue,      revenue);
    const earningsGrowth = pctChange(prevNetIncome,     netIncome);
    const fcfGrowth      = pctChange(prevFreeCashFlow,  freeCashFlow);

    const scores = {
        revenueGrowth:  scoreGrowth(revenueGrowth),
        earningsGrowth: scoreGrowth(earningsGrowth),
        fcfGrowth:      scoreGrowth(fcfGrowth)
    };

    const score  = avg(scores);
    const growth = toGrowthLabel(score);

    return {
        score,
        growth,
        explanation: buildExplanation({ growth, revenueGrowth, earningsGrowth, fcfGrowth }),
        metrics: {
            revenueGrowth:  r2(revenueGrowth),
            earningsGrowth: r2(earningsGrowth),
            fcfGrowth:      r2(fcfGrowth)
        }
    };
}

function pctChange(prev, current) {
    if (prev == null || current == null) return 0;
    if (prev === 0) return current === 0 ? 0 : 100;
    return ((current - prev) / Math.abs(prev)) * 100;
}
function scoreGrowth(rate) {
    if (rate >= 20)  return 100;
    if (rate >= 10)  return 80;
    if (rate >= 5)   return 60;
    if (rate >= 0)   return 40;
    if (rate >= -10) return 20;
    return 5;
}
function toGrowthLabel(score) {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Moderate";
    if (score >= 40) return "Flat";
    return "Declining";
}
function buildExplanation({ growth, revenueGrowth, earningsGrowth, fcfGrowth }) {
    if (growth === "Strong")
        return `Revenue +${r2(revenueGrowth)}%, earnings +${r2(earningsGrowth)}%, FCF +${r2(fcfGrowth)}% YoY — strong expansion.`;
    if (growth === "Moderate")
        return `Steady growth — revenue +${r2(revenueGrowth)}%, earnings +${r2(earningsGrowth)}% YoY.`;
    if (growth === "Flat")
        return `Minimal growth — revenue ${r2(revenueGrowth)}%, earnings ${r2(earningsGrowth)}% YoY.`;
    return `Declining — revenue ${r2(revenueGrowth)}%, earnings ${r2(earningsGrowth)}% YoY.`;
}
function avg(scores) {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}
function r2(n) { return Math.round(n * 100) / 100; }