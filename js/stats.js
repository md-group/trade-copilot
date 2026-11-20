function renderTradeHistory(trades) {
    const table = document.getElementById("tradesTable");
    table.innerHTML = "";

    trades.forEach(trade => {
        const profit = Number(trade.profit || 0);
        const direction = trade.direction === "LONG"
            ? "🟢 LONG"
            : trade.direction === "SHORT"
                ? "🔴 SHORT"
                : "🔵 SPOT";

        table.innerHTML += `
            <tr>
                <td>${trade.symbol || "-"}</td>
                <td>${direction}</td>
                <td>${trade.strategy || "-"}</td>
                <td>${trade.selected_volume ? Number(trade.selected_volume).toFixed(3) : "-"}</td>
                <td style="color:${profit >= 0 ? "#22c55e" : "#ef4444"};font-weight:bold;">
                    ${trade.profit ?? 0}
                </td>
                <td>${trade.risk_reward ?? "-"}</td>
                <td>${trade.setup_score ?? "-"}</td>
                <td><button onclick="editTrade(${trade.id})">✏️</button></td>
                <td><button onclick="deleteTrade(${trade.id})">🗑️</button></td>
            </tr>
        `;
    });
}

function renderStatistics(trades) {
    const currency = document.getElementById("currency").value;
    const strategies = {};
    let totalProfit = 0;
    let winningTrades = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let winAmount = 0;
    let lossAmount = 0;
    let runningProfit = 0;
    let peak = 0;
    let maxDrawdown = 0;
    const equityData = [];

    trades.forEach(trade => {
        const pnl = Number(trade.profit || 0);
        const strategy = trade.strategy || "Unknown";
        if (!strategies[strategy]) {
            strategies[strategy] = { winAmount: 0, lossAmount: 0 };
        }

        totalProfit += pnl;
        runningProfit += pnl;
        equityData.push(runningProfit);

        if (pnl > 0) {
            winningTrades++;
            totalWins++;
            winAmount += pnl;
            strategies[strategy].winAmount += pnl;
        } else if (pnl < 0) {
            totalLosses++;
            lossAmount += Math.abs(pnl);
            strategies[strategy].lossAmount += Math.abs(pnl);
        }

        peak = Math.max(peak, runningProfit);
        if (peak > 0) {
            maxDrawdown = Math.max(maxDrawdown, ((peak - runningProfit) / peak) * 100);
        }
    });

    const tradeCount = trades.length;
    const winRate = tradeCount > 0 ? (winningTrades / tradeCount) * 100 : 0;
    const avgProfit = tradeCount > 0 ? totalProfit / tradeCount : 0;
    const avgWin = totalWins > 0 ? winAmount / totalWins : 0;
    const avgLoss = totalLosses > 0 ? lossAmount / totalLosses : 0;
    const profitFactor = lossAmount > 0 ? winAmount / lossAmount : 0;

    document.getElementById("totalTrades").innerText = tradeCount;
    document.getElementById("winningTrades").innerText = winningTrades;
    document.getElementById("winRate").innerText = winRate.toFixed(1) + "%";
    document.getElementById("totalProfit").innerText = totalProfit.toFixed(0) + " " + currency;
    document.getElementById("avgProfit").innerText = avgProfit.toFixed(0) + " " + currency;
    document.getElementById("avgWin").innerText = avgWin.toFixed(0) + " " + currency;
    document.getElementById("avgLoss").innerText = avgLoss.toFixed(0) + " " + currency;
    document.getElementById("profitFactor").innerText = profitFactor.toFixed(2);

    const drawdownElement = document.getElementById("maxDrawdown");
    drawdownElement.innerText = maxDrawdown.toFixed(2) + "%";
    drawdownElement.style.color =
        maxDrawdown < 5 ? "#22c55e" :
        maxDrawdown < 10 ? "#eab308" :
        "#ef4444";

    document.getElementById("strategyTrades").innerText = tradeCount;
    document.getElementById("strategyWinRate").innerText = winRate.toFixed(1) + "%";
    document.getElementById("strategyProfit").innerText = totalProfit.toFixed(0);
    document.getElementById("strategyAvgProfit").innerText = avgProfit.toFixed(0);
    document.getElementById("strategyProfitFactor").innerText = profitFactor.toFixed(2);

    const ranking = Object.entries(strategies).map(([name, stats]) => ({
        name,
        pf: stats.lossAmount > 0 ? stats.winAmount / stats.lossAmount : 0
    })).sort((a, b) => b.pf - a.pf);

    document.getElementById("strategyRanking").innerHTML = ranking
        .map((item, index) => `<p>${index + 1}. ${item.name} - PF ${item.pf.toFixed(2)}</p>`)
        .join("");

    drawEquityCurve(equityData);
}