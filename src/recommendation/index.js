import { analyzeHealth }    from '../analyzers/health.js';
import { analyzeGrowth }    from '../analyzers/growth.js';
import { analyzeValuation } from '../analyzers/valuation.js';
import { analyzeRisk }      from '../analyzers/risk.js';

// PRD weight table
const WEIGHTS = { health: 0.30, growth: 0.25, valuation: 0.20, risk: 0.15, dividend: 0.10 };

/**
 * Runs all analyzers and combines into one report.
 * @param {Object} fundamentals
 * @returns {{ overallScore, recommendation, confidence, strengths, concerns, breakdown }}
 */
export function analyze(fundamentals) {
    if (!fundamentals) throw new Error("analyze: no fundamentals provided");

    const health    = analyzeHealth(fundamentals);
    const growth    = analyzeGrowth(fundamentals);
    const valuation = analyzeValuation(fundamentals);
    const risk      = analyzeRisk(fundamentals);

    // Higher risk score = lower risk = better; invert so high score adds more to rollup
    const riskContribution = 100 - risk.score;

    const overallScore = Math.round(
        health.score    * WEIGHTS.health    +
        growth.score    * WEIGHTS.growth    +
        valuation.score * WEIGHTS.valuation +
        riskContribution * WEIGHTS.risk     +
        50              * WEIGHTS.dividend  // dividend not implemented yet → neutral 50
    );

    const recommendation = toRecommendation(overallScore);
    // Deterministic confidence: weighted blend of component scores
    const confidence = Math.min(
        Math.round(overallScore * 0.8 + (health.score + growth.score) / 2 * 0.2),
        99
    );

    const strengths = [];
    const concerns  = [];

    if (health.score    >= 75) strengths.push(health.explanation);    else concerns.push(health.explanation);
    if (growth.score    >= 65) strengths.push(growth.explanation);    else concerns.push(growth.explanation);
    if (valuation.score >= 65) strengths.push(valuation.explanation); else concerns.push(valuation.explanation);
    // High risk score = low risk = good
    if (risk.score      >= 60) strengths.push(risk.explanation);      else concerns.push(risk.explanation);

    return {
        overallScore,
        recommendation,
        confidence,
        strengths,
        concerns,
        breakdown: {
            health:    { score: health.score,    status: health.health },
            growth:    { score: growth.score,    status: growth.growth },
            valuation: { score: valuation.score, status: valuation.valuation },
            risk:      { score: risk.score,      status: risk.risk }
        }
    };
}

function toRecommendation(score) {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Strong Candidate";
    if (score >= 70) return "Worth Researching";
    if (score >= 60) return "Proceed Carefully";
    return "High Risk";
}