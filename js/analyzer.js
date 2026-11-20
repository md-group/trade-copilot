function calculateSetupScore(rr, recommendedVolume, securedPercent) {
    let score = 50;
    const messages = [];

    if (rr >= 2) {
        score += 20;
        messages.push("✅ R:R excelent");
    } else if (rr >= 1.5) {
        score += 10;
        messages.push("✅ R:R acceptabil");
    } else {
        score -= 15;
        messages.push("⚠️ R:R slab");
    }

    if (recommendedVolume < 0.02) {
        score += 10;
        messages.push("✅ Volum prudent");
    } else {
        score -= 10;
        messages.push("⚠️ Volum agresiv");
    }

    if (securedPercent > 50) {
        score += 10;
        messages.push("✅ Profit bine protejat");
    }

    return { score: Math.max(0, Math.min(100, score)), messages };
}