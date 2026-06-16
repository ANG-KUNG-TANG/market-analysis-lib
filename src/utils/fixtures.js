// src/utils/fixtures.js

export const healthyStock = {
    symbol: "HLTHY",
    fundamentals: {
        revenue: 100_000_000,
        netIncome: 20_000_000,
        cash: 30_000_000,
        totalDebt: 10_000_000,
        shareholderEquity: 80_000_000,
        currentAssets: 50_000_000,
        currentLiabilities: 20_000_000,
        totalAssets: 120_000_000,
        freeCashFlow: 18_000_000,
        prevRevenue: 80_000_000,
        prevNetIncome: 14_000_000,
        prevFreeCashFlow: 13_000_000
    }
};

export const riskyStock = {
    symbol: "RISKY",
    fundamentals: {
        revenue: 100_000_000,
        netIncome: 2_000_000,
        cash: 1_000_000,
        totalDebt: 90_000_000,
        shareholderEquity: 10_000_000,
        currentAssets: 15_000_000,
        currentLiabilities: 25_000_000,
        totalAssets: 110_000_000,
        freeCashFlow: -3_000_000,
        prevRevenue: 105_000_000,
        prevNetIncome: 5_000_000,
        prevFreeCashFlow: 1_000_000
    }
};

export const borderlineStock = {
    symbol: "MID",
    fundamentals: {
        revenue: 100_000_000,
        netIncome: 8_000_000,
        cash: 5_000_000,
        totalDebt: 40_000_000,
        shareholderEquity: 40_000_000,
        currentAssets: 25_000_000,
        currentLiabilities: 20_000_000,
        totalAssets: 100_000_000,
        freeCashFlow: 6_000_000,
        prevRevenue: 95_000_000,
        prevNetIncome: 7_000_000,
        prevFreeCashFlow: 5_500_000
    }
};