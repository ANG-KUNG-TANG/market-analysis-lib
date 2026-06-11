// test.js

import { fetchHistory, getMaxPrice, getMinPrice, getPercentageGrowth, getPriceEvaluation } from './index.js';

async function runAnalysis() {
  console.log("Fetching Bitcoin data for analysis...\n");
  
  try {
    // 1. Fetch the data
    const history = await fetchHistory('AAPL', 'yahoo');
    
    // 2. Run the analysis
    const max = getMaxPrice(history);
    const min = getMinPrice(history);
    const growth = getPercentageGrowth(history);
    
    // 3. Print a beautiful report!
    console.log("=== 30-DAY MARKET ANALYSIS REPORT ===");
    console.log(`Asset: AAPL`);
    console.log(`Highest Price: $${max.price} (on ${max.date})`);
    console.log(`Lowest Price:  $${min.price} (on ${min.date})`);
    
    // Add a plus sign if the growth is positive
    const growthStr = growth >= 0 ? `+${growth}%` : `${growth}%`;
    console.log(`Overall Trend: ${growthStr}`);
    console.log("=====================================");

  } catch (error) {
    console.error("Analysis Failed:", error.message);
  }
}
async function runBeginnerAnalysis() {
  console.log("Analyzing market conditions for beginners...\n");
  
  try {
    // 1. Fetch Apple stock history from Yahoo
    const history = await fetchHistory('AAPL', 'yahoo');
    
    // 2. Run your new evaluation feature
    const evaluation = getPriceEvaluation(history);
    
    // 3. Print out the easy-to-read report
    console.log("=== BEGINNER MARKET ADVISOR ===");
    console.log(`Current Price:    $${evaluation.currentPrice}`);
    console.log(`30-Day Range:     $${evaluation.min30Day} - $${evaluation.max30Day}`);
    console.log("-------------------------------");
    console.log(`Market Mode:      ${evaluation.mode}`);
    console.log(`Suggested Action: ** ${evaluation.action} **`);
    console.log(`Why?              ${evaluation.description}`);
    console.log("===============================");

  } catch (error) {
    console.error("Analysis Failed:", error.message);
  }
}

runBeginnerAnalysis();
runAnalysis();