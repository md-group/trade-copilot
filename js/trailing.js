function calculateTrailing(entry, trailingStop, profit, pip) {
    const protectedProfit = (entry - trailingStop) * pip;
    const unprotectedProfit = profit - protectedProfit;
    const securedPercent = profit !== 0 ? (protectedProfit / profit) * 100 : 0;
    return { protectedProfit, unprotectedProfit, securedPercent };
}