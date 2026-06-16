/**
 * Analyzes investment risk from fundamentals.
 * @param {Object} fundamentals
 * @returns {{ score: number, risk: string, explanation: string, metrics: Object }}
 */
export function analyzeRisk(fundamentals) {
    if (!fundamentals) throw new Error("analyzeRisk: no fundamentals provided");

    const { beta, totalDebt, shareholderEquity, netIncome, revenue } = fundamentals;

    const debtToEquity = shareholderEquity ? totalDebt / shareholderEquity : Infinity;
    const netMargin    = revenue           ? (netIncome / revenue) * 100   : 0;

    const scores = {
        beta:              scoreBeta(beta),
        debtToEquity:      scoreDebt(debtToEquity),
        earningsStability: scoreMargin(netMargin)
    };

    const score = avg(scores);
    const risk  = toRiskLabel(score);

    return {
        score,
        risk,
        explanation: buildExplanation({ risk, beta, debtToEquity, netMargin }),
        metrics: {
            beta:         r2(beta),
            debtToEquity: r2(debtToEquity),
            netMargin:    r2(netMargin)
        }
    };
}

function scoreBeta(beta) {
    if (beta == null) return 50;
    if (beta <= 0.5)  return 100;
    if (beta <= 1)    return 80;
    if (beta <= 1.5)  return 55;
    if (beta <= 2)    return 30;
    return 10;
}
function scoreDebt(ratio) {
    if (ratio <= 0.3) return 100;
    if (ratio <= 0.6) return 80;
    if (ratio <= 1)   return 60;
    if (ratio <= 2)   return 35;
    return 10;
}
function scoreMargin(margin) {
    if (margin >= 15) return 100;
    if (margin >= 8)  return 80;
    if (margin >= 3)  return 60;
    if (margin >= 0)  return 40;
    return 10;
}
function toRiskLabel(score) {
    if (score >= 80) return "Low";
    if (score >= 60) return "Medium";
    if (score >= 40) return "High";
    return "Very High";
}
function buildExplanation({ risk, beta, debtToEquity, netMargin }) {
    if (risk === "Low")
        return `Low risk — beta ${r2(beta)}, manageable debt (D/E ${r2(debtToEquity)}), solid margins.`;
    if (risk === "Medium")
        return `Moderate risk — beta ${r2(beta)}, D/E ${r2(debtToEquity)}, net margin ${r2(netMargin)}%.`;
    if (risk === "High")
        return `Elevated risk — high beta (${r2(beta)}) or heavy debt load (D/E ${r2(debtToEquity)}).`;
    return `Very high risk — volatile (beta ${r2(beta)}), heavily leveraged (D/E ${r2(debtToEquity)}), thin margins.`;
}
function avg(scores) {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}
function r2(n) { return n == null ? null : Math.round(n * 100) / 100; }