/**
 * Analyzes the health of a company based on its fundamentals
 * @param {Object} fundamentals
 * @returns {{score: number, health: string, explanation: string, metrics: object}}
 */
export function analyzeHealth(fundamentals) {
    if (!fundamentals) throw new Error("analyzeHealth: no fundamentals data provided");

    const { netIncome, revenue, totalDebt, shareholderEquity,
        currentAssets, currentLiabilities, totalAssets } = fundamentals;

    const currentRatio    = currentLiabilities ? currentAssets / currentLiabilities : 0;
    const debtToEquity    = shareholderEquity  ? totalDebt / shareholderEquity      : Infinity;
    const returnOnAssets  = totalAssets        ? (netIncome / totalAssets) * 100    : 0;
    const returnOnEquity  = shareholderEquity  ? (netIncome / shareholderEquity) * 100 : 0;
    // netMargin as percentage (0–100 scale)
    const netMargin       = revenue            ? (netIncome / revenue) * 100        : 0;

    const scores = {
        currentRatio:   scoreCurrentRatio(currentRatio),
        debtToEquity:   scoreDebtToEquity(debtToEquity),
        returnOnAssets: scoreReturnOnAssets(returnOnAssets),
        returnOnEquity: scoreReturnOnEquity(returnOnEquity),
        netMargin:      scoreNetMargin(netMargin)
    };

    const score  = avg(scores);
    const status = toStatus(score);

    return {
        score,
        health: status,
        explanation: buildExplanation({ status, currentRatio, debtToEquity, returnOnEquity, netMargin }),
        metrics: {
            currentRatio:   round2(currentRatio),
            debtToEquity:   round2(debtToEquity),
            returnOnAssets: round2(returnOnAssets),
            returnOnEquity: round2(returnOnEquity),
            netMargin:      round2(netMargin)
        }
    };
}

function scoreCurrentRatio(ratio) {
    if (ratio >= 2)   return 100;
    if (ratio >= 1.5) return 80;
    if (ratio >= 1)   return 60;
    if (ratio >= 0.5) return 40;
    return 20;
}

function scoreDebtToEquity(ratio) {
    if (ratio <= 0.3) return 100;
    if (ratio <= 0.6) return 80;
    if (ratio <= 1)   return 60;
    if (ratio <= 2)   return 40;
    return 20;
}

function scoreReturnOnAssets(pct) {
    if (pct >= 15) return 100;
    if (pct >= 10) return 80;
    if (pct >= 5)  return 60;
    if (pct >= 2)  return 40;
    return 20;
}

function scoreReturnOnEquity(pct) {
    if (pct >= 20) return 100;
    if (pct >= 15) return 80;
    if (pct >= 10) return 60;
    if (pct >= 5)  return 40;
    return 20;
}

// netMargin is a percentage (e.g. 20 means 20%)
function scoreNetMargin(pct) {
    if (pct >= 20) return 100;
    if (pct >= 10) return 80;
    if (pct >= 5)  return 60;
    if (pct >= 0)  return 40;
    return 20;
}

function avg(scores) {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((sum, v) => sum + v, 0) / vals.length);
}

function toStatus(score) {
    if (score >= 80) return "Healthy";
    if (score >= 60) return "Stable";
    if (score >= 40) return "Caution";
    return "At Risk";
}

function buildExplanation({ status, currentRatio, debtToEquity, returnOnEquity, netMargin }) {
    if (status === "Healthy")
        return `Profitable (net margin ${r2(netMargin)}%) with manageable debt (D/E ${r2(debtToEquity)}).`;
    if (status === "Stable")
        return `Reasonable profitability with a current ratio of ${r2(currentRatio)}.`;
    if (status === "Caution")
        return `Warning signs present — elevated D/E (${r2(debtToEquity)}) or thin margins (${r2(netMargin)}%).`;
    return `Significant strain — high leverage (D/E ${r2(debtToEquity)}) and weak ROE (${r2(returnOnEquity)}%).`;
}

function r2(num) { return Math.round(num * 100) / 100; }
function round2(num) { return Math.round(num * 100) / 100; }