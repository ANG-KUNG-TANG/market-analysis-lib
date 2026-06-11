/**
 * finds the highest price in the give historical data.
 * @parma {Array} data - array of { date, price } objects
 * 
 */

export function getMaxPrice(data){
    if (!data || data.length === 0 ) throw new Error("No data provided to analyse")

    return data.reduce((max, current) => {
        return (current.price > max.price) ? current : max;
    });
}

/**
 * find the lowest price in the given historical data
 * @param {Array} data -array of {date, price} objects
 */
export function getMinPrice(data){
    if (!data || data.length === 0) throw new Error("No data provided to analyse")

    return data.reduce((min, current)=>{
        return (current.price < min.price) ? current : min;
    })
}

/**
 * calculates the percentage growth from the first day to the last day.
 * @param {Array} data = Array of { date, price} objects
 * 
 */
export function getPercentageGrowth(data){
    if (!data || data.length < 2)  throw new Error("Not enoguh data to calculate perentage")
    
    const startPrice = data[0].price;
    const endPrice = data[data.length -1].price;

    const percentage = ((endPrice - startPrice)/ startPrice) * 100;

    //round 2 decimal place
    return Math.round(percentage * 100) / 100;
}


/**
 * Evaluates the current price against historical data to determine market mode.
 * @param {Array} data - Array of { date, price } objects
 */
export function getPriceEvaluation(data) {
  if (!data || data.length < 2) throw new Error("Not enough data to evaluate price.");

  // 1. Find Min, Max, and Current Price
  const prices = data.map(item => item.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const current = prices[prices.length - 1];

  // 2. Prevent division by zero if price never changed
  if (max === min) {
    return {
      currentPrice: current,
      mode: "FIX MODE (Flat)",
      action: "Hold / Wait for volume",
      description: "The price is completely flat with zero movement."
    };
  }

  // 3. Calculate where current price sits on a scale of 0 to 1
  const position = (current - min) / (max - min);

  let mode = "";
  let action = "";
  let description = "";

  // 4. Categorize based on the position
  if (position >= 0.8) {
    mode = "EXTREME MODE (Overbought)";
    action = "WAIT";
    description = "The price is near its 30-day high. High risk of dropping.";
  } else if (position >= 0.6) {
    mode = "HIGH MODE";
    action = "CAUTION / WAIT";
    description = "The price is climbing above average. Consider waiting for a pullback.";
  } else if (position >= 0.4) {
    mode = "FIX MODE (Fair Value)";
    action = "BUY / HOLD";
    description = "The price is stable and sitting right in the fair middle zone.";
  } else if (position >= 0.2) {
    mode = "LOW MODE (Discount)";
    action = "BUY";
    description = "The price is lower than average. Good accumulation zone.";
  } else {
    mode = "EXTREME MODE (Oversold)";
    action = "STRONG BUY";
    description = "The price is near 30-day lows. Great potential discount.";
  }

  return {
    currentPrice: current,
    min30Day: min,
    max30Day: max,
    mode: mode,
    action: action,
    description: description
  };
}