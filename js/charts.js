let tradeChart;
let equityChart;

function drawTradeChart(entry, current) {
    const ctx = document.getElementById("tradeChart");
    if (tradeChart) tradeChart.destroy();

    tradeChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Entry", "Current"],
            datasets: [{
                data: [entry, current],
                borderColor: "#2563eb",
                borderWidth: 3,
                pointRadius: 6,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

function drawEquityCurve(equityData) {
    const ctx = document.getElementById("equityChart");
    if (equityChart) equityChart.destroy();

    equityChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: equityData.map((_, index) => index + 1),
            datasets: [{
                label: "Equity",
                data: equityData,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.2)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}