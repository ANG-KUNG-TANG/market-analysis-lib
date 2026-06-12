/**
 * Fetches market history dynamically based on the provider.
 * @param {string} symbol - The ticker symbol (e.g., 'bitcoin' or 'AAPL')
 * @param {string} provider - The API to use ('coingecko' or 'yahoo')
 */
export async function fetchHistory(symbol, provider = 'coingecko') {
    console.log(`Fetching ${symbol} data using provider: ${provider.toUpperCase()}...`);

    switch (provider.toLowerCase()) {
        case 'coingecko':
            try {
                // 1. Fixed: Added missing () to toLowerCase and fixed 'coingecko' spelling
                const url = `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}/market_chart?vs_currency=usd&days=30`;
                
                // 2. Fixed: Combined into one clean fetch call with headers included
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Accept": 'application/json',
                        "User-Agent": 'market-analysis-lib/1.0'
                    }
                });
                
                if (!response.ok) throw new Error("API Limit reached or coin not found");

                const data = await response.json();

                // 3. Fixed: Changed totoLocaleDateString() to have the missing 'e'
                return data.prices.map(item => ({
                    date: new Date(item[0]).toLocaleDateString(),
                    price: Math.round(item[1] * 100) / 100
                }));
            } catch (error) {
                throw new Error(`CoinGecko Error: ${error.message}`);
            }
        
        case 'yahoo':
            try {
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?range=1mo&interval=1d`;
                const response = await fetch(url);
                if (!response.ok) throw new Error("Stock not found");

                const data = await response.json();
                const result = data.chart.result[0];

                // 4. Fixed: Yahoo returns 'timestamp' (singular) and 'indicators' (with an i)
                const timestamps = result.timestamp;
                const price = result.indicators.quote[0].close;

                return timestamps.map((time, index) => ({
                    date: new Date(time * 1000).toLocaleDateString(),
                    price: Math.round(price[index] * 100) / 100
                }));
            } catch (error) {
                // 5. Fixed: Removed the stray 'Y' from the Error string
                throw new Error(`Yahoo Finance Error: ${error.message}`);
            }

        default:
            throw new Error(`Provider ${provider} is not supported. Use 'coingecko' or 'yahoo'.`);
    }
}

