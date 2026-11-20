let editingTradeId = null;

function tradePayload() {
    const rrText = document.getElementById("rrValue").innerText;
    return {
        symbol: document.getElementById("symbol").value.trim().toUpperCase(),
        strategy: document.getElementById("strategy").value,
        selected_volume: parseFloat(document.getElementById("selectedVolume").value) || 0,
        direction: document.getElementById("direction").value,
        entry_price: parseFloat(document.getElementById("entry").value) || null,
        stop_loss: parseFloat(document.getElementById("rrStop").value) || null,
        take_profit: parseFloat(document.getElementById("rrTarget").value) || null,
        trailing_stop: parseFloat(document.getElementById("trailingStop").value) || null,
        risk_reward: parseFloat(rrText.replace("1 : ", "")) || null,
        setup_score: parseFloat(document.getElementById("setupScore").innerText) || null,
        profit: parseFloat(document.getElementById("profit").innerText) || null,
        notes: document.getElementById("notes").value
    };
}

function resetTradeForm() {
    [
        "symbol", "entry", "current", "pip", "selectedVolume",
        "rrEntry", "rrStop", "rrTarget", "trailingStop", "notes"
    ].forEach(id => {
        document.getElementById(id).value = "";
    });

    document.getElementById("direction").value = "";
    document.getElementById("strategy").value = "";
    document.getElementById("saveResult").innerText = "";
    document.getElementById("updateTrade").style.display = "none";
    editingTradeId = null;
    calculate();
}

async function saveTrade() {
    try {
        const { error } = await supabaseClient
            .from("trades")
            .insert([tradePayload()]);
        if (error) throw error;

        resetTradeForm();
        await loadTrades();
    } catch (error) {
        console.error(error);
        document.getElementById("saveResult").innerText = "❌ Eroare la salvare";
    }
}

async function loadTrades() {
    try {
        const symbolFilter = document.getElementById("symbolFilter").value.trim().toUpperCase();
        const strategyFilter = document.getElementById("strategyFilter").value;
        const period = document.getElementById("periodFilter").value;
        let query = supabaseClient.from("trades").select("*");

        if (period !== "ALL") {
            let startDate = new Date();
            if (period === "TODAY") startDate.setHours(0, 0, 0, 0);
            else if (period === "WEEK") startDate.setDate(startDate.getDate() - 7);
            else if (period === "MONTH") startDate.setDate(startDate.getDate() - 30);
            else if (period === "YEAR") startDate = new Date(startDate.getFullYear(), 0, 1);
            query = query.gte("created_at", startDate.toISOString());
        }
        if (symbolFilter) query = query.eq("symbol", symbolFilter);
        if (strategyFilter) query = query.eq("strategy", strategyFilter);

        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;

        const trades = data || [];
        renderTradeHistory(trades);
        renderStatistics(trades);
    } catch (error) {
        console.error(error);
    }
}

async function deleteTrade(id) {
    if (!confirm("Ștergi tranzacția?")) return;
    try {
        const { error } = await supabaseClient.from("trades").delete().eq("id", id);
        if (error) throw error;
        await loadTrades();
    } catch (error) {
        console.error(error);
        alert("Eroare la ștergere");
    }
}

async function editTrade(id) {
    editingTradeId = id;
    const { data, error } = await supabaseClient
        .from("trades")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("symbol").value = data.symbol || "";
    document.getElementById("direction").value = data.direction || "";
    document.getElementById("strategy").value = data.strategy || "";
    document.getElementById("selectedVolume").value = data.selected_volume ?? "";
    document.getElementById("entry").value = data.entry_price ?? "";
    document.getElementById("rrEntry").value = data.entry_price ?? "";
    document.getElementById("rrStop").value = data.stop_loss ?? "";
    document.getElementById("rrTarget").value = data.take_profit ?? "";
    document.getElementById("trailingStop").value = data.trailing_stop ?? "";
    document.getElementById("notes").value = data.notes || "";
    document.getElementById("saveResult").innerText = "";
    document.getElementById("updateTrade").style.display = "block";

    calculate();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateTrade() {
    if (!editingTradeId) return;
    try {
        const { error } = await supabaseClient
            .from("trades")
            .update(tradePayload())
            .eq("id", editingTradeId);
        if (error) throw error;

        resetTradeForm();
        await loadTrades();
    } catch (error) {
        console.error(error);
        alert("❌ Eroare la actualizare");
    }
}