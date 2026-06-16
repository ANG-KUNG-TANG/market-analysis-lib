import { analyzeHealth, analyzeGrowth, analyzeValuation, analyzeRisk, explainMetric, analyze } from '../index.js';
import { healthyStock, riskyStock, borderlineStock } from '../src/utils/fixtures.js';
import StockSense from '../index.js'

let passed = 0, failed = 0;
function assert(label, condition) {
    if (condition) { console.log(`  ✓ ${label}`); passed++; }
    else           { console.error(`  ✗ ${label}`); failed++; }
}
function group(name, fn) { console.log(`\n${name}`); fn(); }

// ─── analyzeHealth ────────────────────────────────────────────────────────────
group("analyzeHealth — output shape", () => {
    const r = analyzeHealth(healthyStock.fundamentals);
    assert("has score",       typeof r.score       === 'number');
    assert("has status",      typeof r.status      === 'string');
    assert("has explanation", typeof r.explanation === 'string');
    assert("has metrics",     typeof r.metrics     === 'object');
});
group("analyzeHealth — scores", () => {
    assert("healthy ≥ 70",   analyzeHealth(healthyStock.fundamentals).score    >= 70);
    assert("healthy=Healthy", analyzeHealth(healthyStock.fundamentals).status  === "Healthy");
    assert("risky < 50",     analyzeHealth(riskyStock.fundamentals).score      <  50);
    assert("risky flags risk",["Caution","At Risk"].includes(analyzeHealth(riskyStock.fundamentals).status));
    assert("healthy > risky", analyzeHealth(healthyStock.fundamentals).score   >  analyzeHealth(riskyStock.fundamentals).score);
});
group("analyzeHealth — guard clauses", () => {
    assert("throws on null",  (() => { try { analyzeHealth(null); return false; } catch { return true; } })());
});

// ─── analyzeGrowth ────────────────────────────────────────────────────────────
group("analyzeGrowth — output shape", () => {
    const r = analyzeGrowth(healthyStock.fundamentals);
    assert("has score",   typeof r.score  === 'number');
    assert("has growth",  typeof r.growth === 'string');
    assert("has metrics", typeof r.metrics.revenueGrowth === 'number');
});
group("analyzeGrowth — scores", () => {
    assert("healthy=Strong",   analyzeGrowth(healthyStock.fundamentals).growth  === "Strong");
    assert("risky=Declining",  analyzeGrowth(riskyStock.fundamentals).growth    === "Declining");
    assert("healthy > risky",  analyzeGrowth(healthyStock.fundamentals).score   >  analyzeGrowth(riskyStock.fundamentals).score);
});
group("analyzeGrowth — zero prev guard", () => {
    const z = { ...borderlineStock.fundamentals, prevRevenue: 0, prevNetIncome: 0, prevFreeCashFlow: 0 };
    assert("no throw on zero prev", (() => { try { analyzeGrowth(z); return true; } catch { return false; } })());
});

// ─── analyzeValuation ────────────────────────────────────────────────────────
group("analyzeValuation — output shape", () => {
    const r = analyzeValuation(healthyStock.fundamentals);
    assert("has score",     typeof r.score     === 'number');
    assert("has valuation", typeof r.valuation === 'string');
    assert("has metrics",   typeof r.metrics   === 'object');
});
group("analyzeValuation — scores", () => {
    assert("healthy=Undervalued or Fair", ["Undervalued","Fair Value"].includes(analyzeValuation(healthyStock.fundamentals).valuation));
    assert("risky=Overvalued",            analyzeValuation(riskyStock.fundamentals).valuation === "Overvalued");
    assert("healthy > risky",             analyzeValuation(healthyStock.fundamentals).score   >  analyzeValuation(riskyStock.fundamentals).score);
});

// ─── analyzeRisk ─────────────────────────────────────────────────────────────
group("analyzeRisk — output shape", () => {
    const r = analyzeRisk(healthyStock.fundamentals);
    assert("has score", typeof r.score === 'number');
    assert("has risk",  typeof r.risk  === 'string');
});
group("analyzeRisk — scores", () => {
    assert("healthy=Low or Medium", ["Low","Medium"].includes(analyzeRisk(healthyStock.fundamentals).risk));
    assert("risky=High or Very High", ["High","Very High"].includes(analyzeRisk(riskyStock.fundamentals).risk));
});

// ─── explainMetric ────────────────────────────────────────────────────────────
group("explainMetric", () => {
    const r = explainMetric('PE', 32);
    assert("has title",          typeof r.title          === 'string');
    assert("has explanation",    typeof r.explanation    === 'string');
    assert("has interpretation", typeof r.interpretation === 'string');
    assert("PE 32 = Slightly expensive", r.interpretation === "Slightly expensive");
    assert("throws on unknown metric", (() => { try { explainMetric('XYZ', 1); return false; } catch { return true; } })());
});

// ─── analyze (recommendation) ─────────────────────────────────────────────────
group("analyze — full report", () => {
    const r = analyze(healthyStock.fundamentals);
    assert("has overallScore",     typeof r.overallScore     === 'number');
    assert("has recommendation",   typeof r.recommendation   === 'string');
    assert("has strengths array",  Array.isArray(r.strengths));
    assert("has concerns array",   Array.isArray(r.concerns));
    assert("has breakdown",        typeof r.breakdown        === 'object');
    assert("healthy scores well",  r.overallScore >= 60);
});

// ─── StockSense class ─────────────────────────────────────────────────────────
group("StockSense — constructor", () => {
    const s = new StockSense(healthyStock);
    assert("stores symbol",       s.symbol === "HLTHY");
    assert("stores fundamentals", typeof s.fundamentals === 'object');
    assert("throws without symbol", (() => { try { new StockSense({}); return false; } catch { return true; } })());
});
group("StockSense — methods delegate correctly", () => {
    const s = new StockSense(healthyStock);
    assert("analyzeHealth() works",    typeof s.analyzeHealth().score    === 'number');
    assert("analyzeGrowth() works",    typeof s.analyzeGrowth().score    === 'number');
    assert("analyzeValuation() works", typeof s.analyzeValuation().score === 'number');
    assert("analyzeRisk() works",      typeof s.analyzeRisk().score      === 'number');
    assert("analyze() works",          typeof s.analyze().overallScore   === 'number');
    assert("explain() works",          typeof s.explain('PE', 20).title  === 'string');
});
group("StockSense — price history methods", () => {
    const priceHistory = [
        { date: '1/1/2026', price: 100 },
        { date: '1/2/2026', price: 120 },
        { date: '1/3/2026', price: 90  }
    ];
    const s = new StockSense({ symbol: 'TEST', priceHistory });
    assert("getMaxPrice() = 120",       s.getMaxPrice().price        === 120);
    assert("getMinPrice() = 90",        s.getMinPrice().price        === 90);
    assert("getPercentageGrowth() = -10", s.getPercentageGrowth()   === -10);
    assert("getPriceEvaluation() has mode", typeof s.getPriceEvaluation().mode === 'string');
});

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);