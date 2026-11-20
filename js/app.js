function value(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function calculateRRDisplay() {
    const rrEntry = value("rrEntry");
    const rrStop = value("rrStop");
    const rrTarget = value("rrTarget");
    const result = calculateRR(rrEntry, rrStop, rrTarget);
    const rrElement = document.getElementById("rrValue");

    rrElement.innerText = result.rr > 0 ? "1 : " + result.rr.toFixed(2) : "-";
    rrElement.className = result.rr >= 2 ? "good" : result.rr >= 1.5 ? "medium" : "bad";
    document.getElementById("minWinRate").innerText =
        result.rr > 0 ? result.winRate.toFixed(1) + "%" : "-";
    return result.rr;
}

function calculate() {
    const entry = value("entry");
    const current = value("current");
    const pip = value("pip");
    const currency = document.getElementById("currency").value;
    const capital = value("capital");
    const riskPercent = value("riskPercent");
    const stopPoints = value("stopPoints");
    const selectedVolume = value("selectedVolume");
    const trailingStop = value("trailingStop");

    const profit = (entry - current) * pip;
    document.getElementById("profit").innerText =
        entry > 0 && current > 0 ? profit.toFixed(0) + " " + currency : "-";

    const risk = calculateRisk(capital, riskPercent, stopPoints, pip);
    document.getElementById("allowedRisk").innerText =
        capital > 0 && riskPercent > 0 ? risk.allowedRisk.toFixed(2) + " " + currency : "-";
    document.getElementById("recommendedVolume").innerText =
        risk.riskPerLot > 0 ? risk.recommendedVolume.toFixed(3) : "-";

    const riskIndicator = document.getElementById("riskIndicator");
    if (risk.recommendedVolume > 0 && selectedVolume > 0) {
        const ratio = selectedVolume / risk.recommendedVolume;
        if (ratio <= 1.2) {
            riskIndicator.innerText = "✅ Volum disciplinat";
            riskIndicator.style.color = "#22c55e";
        } else if (ratio <= 2) {
            riskIndicator.innerText = `⚠️ Volumul este ${ratio.toFixed(1)}x peste recomandare`;
            riskIndicator.style.color = "#eab308";
        } else {
            riskIndicator.innerText = `🚨 Volumul este ${ratio.toFixed(1)}x peste recomandare`;
            riskIndicator.style.color = "#ef4444";
        }
    } else {
        riskIndicator.innerText = "";
    }

    document.getElementById("warning").innerText =
        risk.recommendedVolume < 0.02
            ? "⚠️ Poziția de 0.1 lot este prea mare pentru risc 1%"
            : "✅ Volumul este apropiat de recomandare";

    const trailing = calculateTrailing(entry, trailingStop, profit, pip);
    document.getElementById("protectedProfit").innerText =
        trailing.protectedProfit.toFixed(0) + " " + currency;
    document.getElementById("unprotectedProfit").innerText =
        trailing.unprotectedProfit.toFixed(0) + " " + currency;
    document.getElementById("securedPercent").innerText =
        trailing.securedPercent.toFixed(1);

    const rr = calculateRRDisplay();
    const setup = calculateSetupScore(rr, risk.recommendedVolume, trailing.securedPercent);
    document.getElementById("setupScore").innerText = setup.score;
    document.getElementById("setupDetails").innerHTML = setup.messages.join("<br>");

    drawTradeChart(entry, current);
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", calculate);
});

document.getElementById("saveTrade").addEventListener("click", saveTrade);
document.getElementById("updateTrade").addEventListener("click", updateTrade);
document.getElementById("symbolFilter").addEventListener("input", loadTrades);
document.getElementById("strategyFilter").addEventListener("change", loadTrades);
document.getElementById("periodFilter").addEventListener("change", loadTrades);

calculate();
loadTrades();