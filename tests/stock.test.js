/**
 * StockSense — generic multi-stock test suite
 *
 * Tests run against any stock fixture. Add your own at the bottom.
 * Run from project root:  node stocks.test.js
 */
import StockSense from '../index.js'
import {
    analyzeHealth,
    analyzeGrowth,
    analyzeValuation,
    analyzeRisk,
    explainMetric,
    analyze,
} from '../index.js';

// ─── Test harness ─────────────────────────────────────────────────────────────
let passed = 0, failed = 0, skipped = 0;

function assert(label, condition) {
    if (condition) { console.log(`  ✓ ${label}`); passed++; }
    else           { console.error(`  ✗ ${label}`); failed++; }
}
function group(name, fn) { console.log(`\n  ${name}`); fn(); }

// ─── Stock fixtures ───────────────────────────────────────────────────────────
// All figures are approximate, sourced from public filings (FY2023/2024).
// pe / pb / peg are mid-year market multiples.

const STOCKS = {

    AAPL: {
        label: 'Apple Inc.',
        fundamentals: {
            revenue:            391_035_000_000,
            prevRevenue:        383_285_000_000,
            netIncome:           93_736_000_000,
            prevNetIncome:       96_995_000_000,
            totalAssets:        364_980_000_000,
            totalDebt:          101_304_000_000,
            shareholderEquity:   56_950_000_000,
            currentAssets:      143_566_000_000,
            currentLiabilities: 133_973_000_000,
            freeCashFlow:       111_443_000_000,
            prevFreeCashFlow:    99_584_000_000,
            pe: 29, pb: 48, peg: 2.8, beta: 1.24,
        },
        priceHistory: [
            { date: '1/2/2024',  price: 185.20 }, { date: '1/3/2024',  price: 184.25 },
            { date: '1/4/2024',  price: 181.91 }, { date: '1/5/2024',  price: 181.18 },
            { date: '1/8/2024',  price: 185.56 }, { date: '1/9/2024',  price: 185.33 },
            { date: '1/10/2024', price: 186.19 }, { date: '1/11/2024', price: 186.86 },
            { date: '1/12/2024', price: 185.92 }, { date: '1/16/2024', price: 183.63 },
            { date: '1/17/2024', price: 182.68 }, { date: '1/18/2024', price: 188.32 },
            { date: '1/19/2024', price: 191.56 }, { date: '1/22/2024', price: 191.88 },
            { date: '1/23/2024', price: 192.35 }, { date: '1/24/2024', price: 194.17 },
            { date: '1/25/2024', price: 194.50 }, { date: '1/26/2024', price: 192.42 },
            { date: '1/29/2024', price: 192.53 }, { date: '1/30/2024', price: 193.89 },
            { date: '1/31/2024', price: 184.40 }, { date: '2/1/2024',  price: 186.86 },
            { date: '2/2/2024',  price: 185.04 }, { date: '2/5/2024',  price: 187.15 },
            { date: '2/6/2024',  price: 189.30 }, { date: '2/7/2024',  price: 189.41 },
            { date: '2/8/2024',  price: 188.32 }, { date: '2/9/2024',  price: 188.85 },
            { date: '2/12/2024', price: 187.15 }, { date: '2/13/2024', price: 185.04 },
        ],
        expect: {
            healthScoreMin:     40,   // huge margins but high D/E drags score
            growthLabel:        ['Flat', 'Moderate'],  // ~2% revenue growth
            valuationLabel:     ['Slightly Overvalued', 'Overvalued'],
            riskLabel:          ['Medium', 'High'],
            overallScoreMin:    40,
            priceMin:           180,
            priceMax:           200,
        },
    },

    MSFT: {
        label: 'Microsoft Corp.',
        fundamentals: {
            revenue:            245_122_000_000,
            prevRevenue:        211_915_000_000,
            netIncome:           88_136_000_000,
            prevNetIncome:       72_361_000_000,
            totalAssets:        512_163_000_000,
            totalDebt:           79_409_000_000,
            shareholderEquity:  268_477_000_000,
            currentAssets:      184_257_000_000,
            currentLiabilities:  95_082_000_000,
            freeCashFlow:        74_071_000_000,
            prevFreeCashFlow:    59_475_000_000,
            pe: 35, pb: 13, peg: 2.1, beta: 0.90,
        },
        priceHistory: [
            { date: '1/2/2024',  price: 374.00 }, { date: '1/3/2024',  price: 370.87 },
            { date: '1/4/2024',  price: 373.26 }, { date: '1/5/2024',  price: 371.00 },
            { date: '1/8/2024',  price: 375.93 }, { date: '1/9/2024',  price: 374.27 },
            { date: '1/10/2024', price: 378.92 }, { date: '1/11/2024', price: 376.17 },
            { date: '1/12/2024', price: 388.47 }, { date: '1/16/2024', price: 389.47 },
            { date: '1/17/2024', price: 384.57 }, { date: '1/18/2024', price: 391.51 },
            { date: '1/19/2024', price: 397.12 }, { date: '1/22/2024', price: 404.87 },
            { date: '1/23/2024', price: 406.32 }, { date: '1/24/2024', price: 404.06 },
            { date: '1/25/2024', price: 408.62 }, { date: '1/26/2024', price: 406.11 },
            { date: '1/29/2024', price: 407.00 }, { date: '1/30/2024', price: 408.11 },
            { date: '1/31/2024', price: 403.93 }, { date: '2/1/2024',  price: 408.23 },
            { date: '2/2/2024',  price: 409.49 }, { date: '2/5/2024',  price: 405.56 },
            { date: '2/6/2024',  price: 406.31 }, { date: '2/7/2024',  price: 411.22 },
            { date: '2/8/2024',  price: 409.83 }, { date: '2/9/2024',  price: 415.33 },
            { date: '2/12/2024', price: 415.23 }, { date: '2/13/2024', price: 406.32 },
        ],
        expect: {
            healthScoreMin:     65,
            growthLabel:        ['Strong', 'Moderate'],  // ~15% revenue growth
            valuationLabel:     ['Slightly Overvalued', 'Overvalued'],
            riskLabel:          ['Low', 'Medium'],
            overallScoreMin:    55,
            priceMin:           360,
            priceMax:           430,
        },
    },

    NVDA: {
        label: 'NVIDIA Corp.',
        fundamentals: {
            revenue:            60_922_000_000,
            prevRevenue:        26_974_000_000,
            netIncome:          29_760_000_000,
            prevNetIncome:       4_368_000_000,
            totalAssets:        65_728_000_000,
            totalDebt:           8_462_000_000,
            shareholderEquity:  42_978_000_000,
            currentAssets:      44_345_000_000,
            currentLiabilities: 10_631_000_000,
            freeCashFlow:       27_021_000_000,
            prevFreeCashFlow:    3_808_000_000,
            pe: 65, pb: 25, peg: 1.2, beta: 1.68,
        },
        priceHistory: [
            { date: '1/2/2024',  price: 495.22 }, { date: '1/3/2024',  price: 481.68 },
            { date: '1/4/2024',  price: 493.52 }, { date: '1/5/2024',  price: 480.44 },
            { date: '1/8/2024',  price: 522.53 }, { date: '1/9/2024',  price: 519.90 },
            { date: '1/10/2024', price: 547.10 }, { date: '1/11/2024', price: 544.27 },
            { date: '1/12/2024', price: 560.00 }, { date: '1/16/2024', price: 563.82 },
            { date: '1/17/2024', price: 547.47 }, { date: '1/18/2024', price: 594.91 },
            { date: '1/19/2024', price: 613.62 }, { date: '1/22/2024', price: 615.00 },
            { date: '1/23/2024', price: 616.06 }, { date: '1/24/2024', price: 612.72 },
            { date: '1/25/2024', price: 613.52 }, { date: '1/26/2024', price: 615.27 },
            { date: '1/29/2024', price: 628.49 }, { date: '1/30/2024', price: 629.32 },
            { date: '1/31/2024', price: 613.15 }, { date: '2/1/2024',  price: 624.90 },
            { date: '2/2/2024',  price: 674.72 }, { date: '2/5/2024',  price: 661.40 },
            { date: '2/6/2024',  price: 661.44 }, { date: '2/7/2024',  price: 671.00 },
            { date: '2/8/2024',  price: 694.52 }, { date: '2/9/2024',  price: 721.28 },
            { date: '2/12/2024', price: 726.91 }, { date: '2/13/2024', price: 739.00 },
        ],
        expect: {
            healthScoreMin:     70,
            growthLabel:        ['Strong'],       // >120% revenue growth YoY
            valuationLabel:     ['Slightly Overvalued', 'Overvalued'],  // PE 65
            riskLabel:          ['Medium', 'High'],
            overallScoreMin:    50,
            priceMin:           470,
            priceMax:           750,
        },
    },

    TSLA: {
        label: 'Tesla Inc.',
        fundamentals: {
            revenue:            97_690_000_000,
            prevRevenue:        81_462_000_000,
            netIncome:           14_974_000_000,
            prevNetIncome:       12_556_000_000,
            totalAssets:        106_618_000_000,
            totalDebt:            5_245_000_000,
            shareholderEquity:   62_634_000_000,
            currentAssets:       49_616_000_000,
            currentLiabilities:  28_674_000_000,
            freeCashFlow:         4_358_000_000,
            prevFreeCashFlow:     7_566_000_000,
            pe: 55, pb: 12, peg: 2.5, beta: 2.02,
        },
        priceHistory: [
            { date: '1/2/2024',  price: 248.42 }, { date: '1/3/2024',  price: 238.45 },
            { date: '1/4/2024',  price: 237.93 }, { date: '1/5/2024',  price: 235.10 },
            { date: '1/8/2024',  price: 240.45 }, { date: '1/9/2024',  price: 234.46 },
            { date: '1/10/2024', price: 236.53 }, { date: '1/11/2024', price: 231.14 },
            { date: '1/12/2024', price: 218.89 }, { date: '1/16/2024', price: 219.91 },
            { date: '1/17/2024', price: 215.69 }, { date: '1/18/2024', price: 219.28 },
            { date: '1/19/2024', price: 213.57 }, { date: '1/22/2024', price: 208.80 },
            { date: '1/23/2024', price: 207.83 }, { date: '1/24/2024', price: 207.03 },
            { date: '1/25/2024', price: 182.63 }, { date: '1/26/2024', price: 184.23 },
            { date: '1/29/2024', price: 192.38 }, { date: '1/30/2024', price: 190.15 },
            { date: '1/31/2024', price: 187.29 }, { date: '2/1/2024',  price: 188.86 },
            { date: '2/2/2024',  price: 186.40 }, { date: '2/5/2024',  price: 187.29 },
            { date: '2/6/2024',  price: 181.76 }, { date: '2/7/2024',  price: 184.26 },
            { date: '2/8/2024',  price: 186.93 }, { date: '2/9/2024',  price: 193.57 },
            { date: '2/12/2024', price: 194.15 }, { date: '2/13/2024', price: 185.89 },
        ],
        expect: {
            healthScoreMin:     55,
            growthLabel:        ['Moderate', 'Strong', 'Flat'],
            valuationLabel:     ['Slightly Overvalued', 'Overvalued'],
            riskLabel:          ['High', 'Very High', 'Medium'],
            overallScoreMin:    40,
            priceMin:           180,
            priceMax:           260,
        },
    },

    JNJ: {
        label: 'Johnson & Johnson',
        fundamentals: {
            revenue:            85_159_000_000,
            prevRevenue:        93_775_000_000,
            netIncome:          13_446_000_000,
            prevNetIncome:      17_941_000_000,
            totalAssets:       167_558_000_000,
            totalDebt:          35_053_000_000,
            shareholderEquity:  68_774_000_000,
            currentAssets:      55_025_000_000,
            currentLiabilities: 33_239_000_000,
            freeCashFlow:       14_954_000_000,
            prevFreeCashFlow:   16_352_000_000,
            pe: 16, pb: 5, peg: 2.0, beta: 0.56,
        },
        priceHistory: [
            { date: '1/2/2024',  price: 156.74 }, { date: '1/3/2024',  price: 155.97 },
            { date: '1/4/2024',  price: 158.08 }, { date: '1/5/2024',  price: 157.02 },
            { date: '1/8/2024',  price: 158.54 }, { date: '1/9/2024',  price: 157.53 },
            { date: '1/10/2024', price: 158.52 }, { date: '1/11/2024', price: 156.76 },
            { date: '1/12/2024', price: 155.48 }, { date: '1/16/2024', price: 156.24 },
            { date: '1/17/2024', price: 154.66 }, { date: '1/18/2024', price: 156.24 },
            { date: '1/19/2024', price: 158.13 }, { date: '1/22/2024', price: 158.26 },
            { date: '1/23/2024', price: 158.55 }, { date: '1/24/2024', price: 161.11 },
            { date: '1/25/2024', price: 161.98 }, { date: '1/26/2024', price: 160.87 },
            { date: '1/29/2024', price: 162.11 }, { date: '1/30/2024', price: 163.27 },
            { date: '1/31/2024', price: 160.98 }, { date: '2/1/2024',  price: 162.88 },
            { date: '2/2/2024',  price: 163.11 }, { date: '2/5/2024',  price: 159.38 },
            { date: '2/6/2024',  price: 158.86 }, { date: '2/7/2024',  price: 160.43 },
            { date: '2/8/2024',  price: 159.72 }, { date: '2/9/2024',  price: 160.98 },
            { date: '2/12/2024', price: 159.45 }, { date: '2/13/2024', price: 157.84 },
        ],
        expect: {
            healthScoreMin:     55,
            growthLabel:        ['Declining', 'Flat'],  // revenue fell ~9% YoY after spinoff
            valuationLabel:     ['Undervalued', 'Fair Value', 'Slightly Overvalued'],
            riskLabel:          ['Low', 'Medium'],  // beta 0.56
            overallScoreMin:    45,
            priceMin:           150,
            priceMax:           170,
        },
    },
};

// ─── Generic test runner ──────────────────────────────────────────────────────
function runStockTests(symbol, { label, fundamentals, priceHistory, expect: ex }) {
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`  ${symbol} — ${label}`);
    console.log(`${'═'.repeat(50)}`);

    // ── Constructor ──
    group('StockSense class', () => {
        const s = new StockSense({ symbol, fundamentals, priceHistory });
        assert(`symbol = ${symbol}`,              s.symbol === symbol);
        assert('fundamentals object',             typeof s.fundamentals === 'object');
        assert('priceHistory has 30 points',      s.priceHistory.length === 30);
    });

    // ── Health ──
    group('analyzeHealth', () => {
        const h = analyzeHealth(fundamentals);
        assert('returns score (number)',          typeof h.score === 'number');
        assert('score in 0–100',                  h.score >= 0 && h.score <= 100);
        assert('health label is string',          typeof h.health === 'string');
        assert('status alias present',            typeof h.status === 'string');
        assert('health === status',               h.health === h.status);
        assert('has explanation',                 typeof h.explanation === 'string');
        assert('has metrics object',              typeof h.metrics === 'object');
        assert('metrics.netMargin is number',     typeof h.metrics.netMargin === 'number');
        assert('metrics.debtToEquity is number',  typeof h.metrics.debtToEquity === 'number');
        assert(`score ≥ ${ex.healthScoreMin}`,    h.score >= ex.healthScoreMin);
        assert('valid health label', ['Healthy', 'Stable', 'Caution', 'At Risk'].includes(h.health));
        console.log(`    ℹ  score=${h.score} (${h.health})`);
    });

    // ── Growth ──
    group('analyzeGrowth', () => {
        const g = analyzeGrowth(fundamentals);
        assert('returns score (number)',          typeof g.score === 'number');
        assert('score in 0–100',                  g.score >= 0 && g.score <= 100);
        assert('growth label is string',          typeof g.growth === 'string');
        assert('has metrics.revenueGrowth',       typeof g.metrics.revenueGrowth === 'number');
        assert('has metrics.earningsGrowth',      typeof g.metrics.earningsGrowth === 'number');
        assert('has metrics.fcfGrowth',           typeof g.metrics.fcfGrowth === 'number');
        assert(`growth in expected set`,          ex.growthLabel.includes(g.growth));
        assert('valid growth label', ['Strong','Moderate','Flat','Declining'].includes(g.growth));
        console.log(`    ℹ  score=${g.score} (${g.growth}) | rev=${g.metrics.revenueGrowth}%`);
    });

    // ── Valuation ──
    group('analyzeValuation', () => {
        const v = analyzeValuation(fundamentals);
        assert('returns score (number)',          typeof v.score === 'number');
        assert('score in 0–100',                  v.score >= 0 && v.score <= 100);
        assert('valuation label is string',       typeof v.valuation === 'string');
        assert('has metrics.pe',                  v.metrics.pe === fundamentals.pe);
        assert('has metrics.pb',                  v.metrics.pb === fundamentals.pb);
        assert('has metrics.peg',                 v.metrics.peg === fundamentals.peg);
        assert('valuation in expected set',       ex.valuationLabel.includes(v.valuation));
        assert('valid valuation label', ['Undervalued','Fair Value','Slightly Overvalued','Overvalued'].includes(v.valuation));
        console.log(`    ℹ  score=${v.score} (${v.valuation}) | PE=${fundamentals.pe}, PB=${fundamentals.pb}, PEG=${fundamentals.peg}`);
    });

    // ── Risk ──
    group('analyzeRisk', () => {
        const r = analyzeRisk(fundamentals);
        assert('returns score (number)',          typeof r.score === 'number');
        assert('score in 0–100',                  r.score >= 0 && r.score <= 100);
        assert('risk label is string',            typeof r.risk === 'string');
        assert('has metrics.beta',                r.metrics.beta === fundamentals.beta);
        assert('has metrics.debtToEquity',        typeof r.metrics.debtToEquity === 'number');
        assert('has metrics.netMargin',           typeof r.metrics.netMargin === 'number');
        assert('risk in expected set',            ex.riskLabel.includes(r.risk));
        assert('valid risk label', ['Low','Medium','High','Very High'].includes(r.risk));
        console.log(`    ℹ  score=${r.score} (${r.risk}) | beta=${fundamentals.beta}`);
    });

    // ── Full report ──
    group('analyze() — full report', () => {
        const r = analyze(fundamentals);
        assert('has overallScore',                typeof r.overallScore === 'number');
        assert('score in 0–100',                  r.overallScore >= 0 && r.overallScore <= 100);
        assert('has recommendation',              typeof r.recommendation === 'string');
        assert('has confidence (number)',         typeof r.confidence === 'number');
        assert('confidence < 100',                r.confidence < 100);
        assert('confidence is deterministic',     r.confidence === analyze(fundamentals).confidence);
        assert('strengths is array',              Array.isArray(r.strengths));
        assert('concerns is array',               Array.isArray(r.concerns));
        assert('strengths + concerns = 4',        r.strengths.length + r.concerns.length === 4);
        assert('breakdown.health has score',      typeof r.breakdown.health.score === 'number');
        assert('breakdown.growth has score',      typeof r.breakdown.growth.score === 'number');
        assert('breakdown.valuation has score',   typeof r.breakdown.valuation.score === 'number');
        assert('breakdown.risk has score',        typeof r.breakdown.risk.score === 'number');
        assert(`overallScore ≥ ${ex.overallScoreMin}`, r.overallScore >= ex.overallScoreMin);
        assert('valid recommendation', [
            'Excellent','Strong Candidate','Worth Researching','Proceed Carefully','High Risk'
        ].includes(r.recommendation));
        console.log(`    ℹ  overallScore=${r.overallScore} → ${r.recommendation} (confidence: ${r.confidence})`);
    });

    // ── Price history ──
    group('Price history analysis', () => {
        const s   = new StockSense({ symbol, fundamentals, priceHistory });
        const max = s.getMaxPrice();
        const min = s.getMinPrice();
        const pct = s.getPercentageGrowth();
        const ev  = s.getPriceEvaluation();

        assert('getMaxPrice returns object',      typeof max === 'object');
        assert('getMinPrice returns object',      typeof min === 'object');
        assert('max.price is number',             typeof max.price === 'number');
        assert('min.price is number',             typeof min.price === 'number');
        assert('max ≥ min',                       max.price >= min.price);
        assert(`max in expected range`,           max.price >= ex.priceMin && max.price <= ex.priceMax);
        assert(`min in expected range`,           min.price >= ex.priceMin && min.price <= ex.priceMax);
        assert('getPercentageGrowth is number',   typeof pct === 'number');
        assert('getPriceEvaluation has mode',     typeof ev.mode === 'string');
        assert('getPriceEvaluation has action',   typeof ev.action === 'string');
        assert('getPriceEvaluation has currentPrice', typeof ev.currentPrice === 'number');
        assert('valid mode', [
            'EXTREME MODE (Overbought)','HIGH MODE','FIX MODE (Fair Value)',
            'LOW MODE (Discount)','EXTREME MODE (Oversold)','FIX MODE (Flat)'
        ].includes(ev.mode));
        console.log(`    ℹ  $${min.price} – $${max.price} | growth: ${pct}% | mode: ${ev.mode}`);
    });

    // ── explainMetric with this stock's values ──
    group('explainMetric', () => {
        const pe   = explainMetric('PE',   fundamentals.pe);
        const beta = explainMetric('BETA', fundamentals.beta);
        assert('PE has title',                    typeof pe.title === 'string');
        assert('PE has explanation',              typeof pe.explanation === 'string');
        assert('PE has interpretation',           typeof pe.interpretation === 'string');
        assert('BETA has interpretation',         typeof beta.interpretation === 'string');
        assert('throws on unknown metric', (() => { try { explainMetric('XYZ', 1); return false; } catch { return true; } })());
    });
}

// ─── Run all ──────────────────────────────────────────────────────────────────
for (const [symbol, stock] of Object.entries(STOCKS)) {
    runStockTests(symbol, stock);
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(50)}`);
console.log(`  ${Object.keys(STOCKS).length} stocks tested`);
console.log(`  ${passed} passed, ${failed} failed`);
console.log(`${'═'.repeat(50)}\n`);
if (failed > 0) process.exit(1);