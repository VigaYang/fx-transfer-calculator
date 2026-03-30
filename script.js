const chart = echarts.init(document.getElementById("chart"));

function formatAmount(n) {
    if (!Number.isFinite(n)) return "-";
    return Number(n).toLocaleString(undefined, {
        maximumFractionDigits: 2
    });
}

function setSummaryStatus(text, type) {
    const statusEl = document.getElementById("summaryStatus");
    statusEl.textContent = text;
    statusEl.classList.remove("positive", "negative", "neutral");
    statusEl.classList.add(type);
}

function netGainForAmount(amountToCurrency, p) {
    // FX cost to acquire the destination-currency amount
    const fx_cost = amountToCurrency * p.fx_rate;

    // Percentage service fee based on FX cost, with min/max caps
    const raw_service_fee = p.service_rate * fx_cost;
    const service_fee = Math.min(Math.max(raw_service_fee, p.min_cap), p.max_cap);

    // Receiving bank fee in destination currency, converted into source currency
    const to_fee_in_from = p.to_fee * p.fx_rate;

    // Total fees in source-currency equivalent
    const total_fees = service_fee + p.fixed_fee + to_fee_in_from;

    // Total source-currency outlay
    const outlay = fx_cost + total_fees;

    // Interest earned in destination, converted back to source currency equivalent
    const interest_to = amountToCurrency * p.to_interest * p.fx_rate;

    // Interest that would have been earned if the same source-currency outlay stayed at home
    const interest_from = outlay * p.from_interest;

    return {
        profit: interest_to - interest_from,
        raw_service_fee: raw_service_fee
    };
}

function getParams() {
    return {
        from_country: document.getElementById("from_country").value.trim() || "From Country",
        to_country: document.getElementById("to_country").value.trim() || "To Country",
        fx_rate: parseFloat(document.getElementById("fx_rate").value) || 0,
        from_interest: parseFloat(document.getElementById("from_interest").value) || 0,
        to_interest: parseFloat(document.getElementById("to_interest").value) || 0,
        service_rate: parseFloat(document.getElementById("service_rate").value) || 0,
        min_cap: parseFloat(document.getElementById("min_cap").value) || 0,
        max_cap: parseFloat(document.getElementById("max_cap").value) || 0,
        fixed_fee: parseFloat(document.getElementById("fixed_fee").value) || 0,
        to_fee: parseFloat(document.getElementById("to_fee").value) || 0,
        max_amount: parseFloat(document.getElementById("max_amount").value) || 100000,
        x_tick_step: parseFloat(document.getElementById("x_tick_step").value) || 5000,
        target_amount: parseFloat(document.getElementById("target_amount").value) || 0
    };
}

function buildSeriesData(p) {
    const minCapData = [];
    const linearData = [];
    const maxCapData = [];
    const allData = [];

    for (let amount = 0; amount <= p.max_amount; amount += 200) {
        const result = netGainForAmount(amount, p);
        allData.push([amount, result.profit]);

        if (result.raw_service_fee < p.min_cap) {
            minCapData.push([amount, result.profit]);
            linearData.push([amount, null]);
            maxCapData.push([amount, null]);
        } else if (result.raw_service_fee > p.max_cap) {
            minCapData.push([amount, null]);
            linearData.push([amount, null]);
            maxCapData.push([amount, result.profit]);
        } else {
            minCapData.push([amount, null]);
            linearData.push([amount, result.profit]);
            maxCapData.push([amount, null]);
        }
    }

    return { minCapData, linearData, maxCapData, allData };
}

function findBreakEvenPoints(allData) {
    const points = [];

    for (let i = 1; i < allData.length; i++) {
        const [x0, y0] = allData[i - 1];
        const [x1, y1] = allData[i];

        if (y0 === 0) {
            points.push([x0, 0]);
        }

        if (y0 === 0 || y1 === 0) {
            continue;
        }

        if (y0 * y1 < 0) {
            const x = x0 + (0 - y0) * (x1 - x0) / (y1 - y0);
            points.push([x, 0]);
        }
    }

    return points;
}

function updateSummary(p, breakEvenPoints, targetProfit) {
    const targetAmountEl = document.getElementById("summaryTargetAmount");
    const targetProfitEl = document.getElementById("summaryTargetProfit");
    const breakevenEl = document.getElementById("summaryBreakeven");
    const noteEl = document.getElementById("summaryNote");

    targetAmountEl.textContent = `${formatAmount(p.target_amount)} (${p.to_country})`;

    if (p.target_amount <= 0) {
        targetProfitEl.textContent = "-";
        setSummaryStatus("Enter a target amount", "neutral");
        breakevenEl.textContent = breakEvenPoints.length
            ? `${formatAmount(breakEvenPoints[0][0])} (${p.to_country})`
            : "None in range";
        noteEl.textContent = "Target amount is not set.";
        return;
    }

    targetProfitEl.textContent = `${formatAmount(targetProfit)} (${p.from_country} equiv.)`;

    if (targetProfit > 0) {
        setSummaryStatus("Profitable", "positive");
    } else if (targetProfit < 0) {
        setSummaryStatus("Not profitable", "negative");
    } else {
        setSummaryStatus("Breakeven", "neutral");
    }

    if (breakEvenPoints.length > 0) {
        const [x, y] = breakEvenPoints[0];
        breakevenEl.textContent = `${formatAmount(x)} (${p.to_country}), ${formatAmount(y)}`;
        noteEl.textContent = `First breakeven point found within the plotted range.`;
    } else {
        breakevenEl.textContent = "None in range";
        noteEl.textContent = `No breakeven point found within the plotted range.`;
    }
}

function updateChart() {
    const p = getParams();
    const { minCapData, linearData, maxCapData, allData } = buildSeriesData(p);

    const breakEvenPointsRaw = findBreakEvenPoints(allData);
    const breakEvenPoints = breakEvenPointsRaw.map(pt => ({
        value: pt
    }));

    const targetProfit = p.target_amount > 0
        ? netGainForAmount(p.target_amount, p).profit
        : null;

    const targetPoint =
        p.target_amount > 0 && p.target_amount <= p.max_amount
            ? [{ value: [p.target_amount, targetProfit] }]
            : [];

    updateSummary(p, breakEvenPointsRaw, targetProfit);

    const fromCountry = p.from_country;
    const toCountry = p.to_country;

    const option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "line"
            },
            formatter: function (params) {
                const pnt = params.find(
                    x => x.data && x.data[1] !== null && x.data[1] !== undefined
                );
                if (!pnt) return "";

                const [x, y] = pnt.data;
                return `
                    ${pnt.seriesName}<br>
                    Amount: ${Number(x).toFixed(0)}<br>
                    Profit: ${Number(y).toFixed(2)}
                `;
            }
        },
        xAxis: {
            type: "value",
            name: `Amount (${toCountry})`,
            min: 0,
            max: p.max_amount,
            interval: p.x_tick_step
        },
        yAxis: {
            type: "value",
            name: `Profit (${fromCountry} equivalent)`
        },
        series: [
            {
                name: "Min fee regime",
                type: "line",
                showSymbol: false,
                connectNulls: false,
                data: minCapData
            },
            {
                name: "Linear fee regime",
                type: "line",
                showSymbol: false,
                connectNulls: false,
                data: linearData
            },
            {
                name: "Max fee regime",
                type: "line",
                showSymbol: false,
                connectNulls: false,
                data: maxCapData
            },
            {
                name: "Breakeven",
                type: "scatter",
                symbolSize: 12,
                data: breakEvenPoints,
                z: 10,
                label: {
                    show: true,
                    position: "top",
                    formatter: function (params) {
                        return `Breakeven\nAmount: ${Number(params.value[0]).toFixed(0)}\nProfit: ${Number(params.value[1]).toFixed(2)}`;
                    }
                }
            },
            {
                name: "Target Amount",
                type: "scatter",
                symbolSize: 12,
                data: targetPoint,
                z: 10,
                label: {
                    show: true,
                    position: "top",
                    formatter: function (params) {
                        return `Target\nAmount: ${Number(params.value[0]).toFixed(0)}\nProfit: ${Number(params.value[1]).toFixed(2)}`;
                    }
                },
                markLine: {
                    silent: true,
                    symbol: ["none", "none"],
                    lineStyle: {
                        type: "dashed",
                        width: 2
                    },
                    label: {
                        show: true,
                        formatter: function () {
                            return `Target Amount = ${Number(p.target_amount).toFixed(0)}`;
                        }
                    },
                    data: [
                        {
                            xAxis: p.target_amount
                        }
                    ]
                }
            }
        ]
    };

    chart.setOption(option, true);
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateChart);
});

document.getElementById("updateBtn").addEventListener("click", updateChart);

window.addEventListener("resize", () => chart.resize());

updateChart();
