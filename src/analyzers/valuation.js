/**
 * Analyzes whether a stock is over/under/fairly valued.
 * @param {Object} fundamentals
 * @returns {{ score: number, valuation: string, explanation: string, metrics: Object }}
 */
export function analyzeValuation(fundamentals) {
    if (!fundamentals) throw new Error("analyzeValuation: no fundamentals provided");

    const { pe, pb, peg } = fundamentals;

    const scores = {
        pe:  scorePE(pe),
        pb:  scorePB(pb),
        peg: scorePEG(peg)
    };

    const score     = avg(scores);
    const valuation = toValuationLabel(score);

    return {
        score,
        valuation,
        explanation: buildExplanation({ valuation, pe, pb, peg }),
        metrics: { pe: r2(pe), pb: r2(pb), peg: r2(peg) }
    };
}

function scorePE(pe) {
    if (pe == null) return 50;
    if (pe <= 10)   return 100;
    if (pe <= 15)   return 85;
    if (pe <= 20)   return 70;
    if (pe <= 30)   return 50;
    if (pe <= 40)   return 30;
    return 10;
}
function scorePB(pb) {
    if (pb == null) return 50;
    if (pb <= 1)    return 100;
    if (pb <= 2)    return 80;
    if (pb <= 3)    return 65;
    if (pb <= 5)    return 40;
    return 15;
}
function scorePEG(peg) {
    if (peg == null) return 50;
    if (peg <= 1)    return 100;
    if (peg <= 1.5)  return 80;
    if (peg <= 2)    return 60;
    if (peg <= 3)    return 35;
    return 10;
}
function toValuationLabel(score) {
    if (score >= 80) return "Undervalued";
    if (score >= 60) return "Fair Value";
    if (score >= 40) return "Slightly Overvalued";
    return "Overvalued";
}
function buildExplanation({ valuation, pe, pb, peg }) {
    if (valuation === "Undervalued")
        return `Trading at attractive levels — PE ${r2(pe)}, PB ${r2(pb)}, PEG ${r2(peg)}.`;
    if (valuation === "Fair Value")
        return `Trading near fair value — PE ${r2(pe)}, PB ${r2(pb)}.`;
    if (valuation === "Slightly Overvalued")
        return `Slightly elevated — PE ${r2(pe)}, PEG ${r2(peg)}. Wait for a pullback.`;
    return `Expensive relative to fundamentals — PE ${r2(pe)}, PB ${r2(pb)}, PEG ${r2(peg)}.`;
}
function avg(scores) {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
}
function r2(n) { return n == null ? null : Math.round(n * 100) / 100; }