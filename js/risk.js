function calculateRR(entry, stop, target) {
    const risk = Math.abs(stop - entry);
    const reward = Math.abs(target - entry);
    if (risk <= 0) return { rr: 0, winRate: 0 };

    const rr = reward / risk;
    return { rr, winRate: 100 / (1 + rr) };
}

function calculateRisk(capital, riskPercent, stopPoints, pip) {
    const allowedRisk = capital * (riskPercent / 100);
    const riskPerLot = stopPoints * pip;
    const recommendedVolume = riskPerLot > 0 ? allowedRisk / riskPerLot : 0;
    return { allowedRisk, riskPerLot, recommendedVolume };
}