const chart = echarts.init(document.getElementById("chart"));

function netGainForGBP(G, p) {
    const G_sent = G + p.uk_fee;
    const fx_cost = G_sent * p.fx_rate;

    const raw_fee = p.service_rate * fx_cost;
    const service_fee = Math.min(Math.max(raw_fee, p.min_cap), p.max_cap);

    const fees_cn = service_fee + 150;
    const outlay = fx_cost + fees_cn;

    const interest_uk = G * p.fx_rate * p.uk_interest;
    const interest_cn = outlay * p.china_interest;

    return {
        profit: interest_uk - interest_cn - fees_cn,
        raw_fee: raw_fee
    };
}

function getParams() {
    return {
        fx_rate: parseFloat(document.getElementById("fx_rate").value) || 0,
        china_interest: parseFloat(document.getElementById("china_interest").value) || 0,
        uk_interest: parseFloat(document.getElementById("uk_interest").value) || 0,
        service_rate: parseFloat(document.getElementById("service_rate").value) || 0,
        min_cap: parseFloat(document.getElementById("min_cap").value) || 0,
        max_cap: parseFloat(document.getElementById("max_cap").value) || 0,
        uk_fee: parseFloat(document.getElementById("uk_fee").value) || 0,
        max_gbp: parseFloat(document.getElementById("max_gbp").value) || 100000,
        x_tick_step: parseFloat(document.getElementById("x_tick_step").value) || 5000,
        target_gbp: parseFloat(document.getElementById("target_gbp").value) || 0
    };
}

function buildSeriesData(p) {
    const minCapData = [];
    const linearData = [];
    const maxCapData = [];
    const allData = [];

    for (let G = 0; G <= p.max_gbp; G += 200) {
        const result = netGainForGBP(G, p);
        allData.push([G, result.profit]);

        if (result.raw_fee < p.min_cap) {
            minCapData.push([G, result.profit]);
            linearData.push([G, null]);
            maxCapData.push([G, null]);
        } else if (result.raw_fee > p.max_cap) {
            minCapData.push([G, null]);
            linearData.push([G, null]);
            maxCapData.push([G, result.profit]);
        } else {
            minCapData.push([G, null]);
            linearData.push([G, result.profit]);
            maxCapData.push([G, null]);
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

function updateChart() {
    const p = getParams();
    const { minCapData, linearData, maxCapData, allData } = buildSeriesData(p);

    const breakEvenPoints = findBreakEvenPoints(allData).map(pt => ({
        value: pt
    }));

    const targetProfit = netGainForGBP(p.target_gbp, p).profit;
    const targetPoint =
        p.target_gbp > 0 && p.target_gbp <= p.max_gbp
            ? [{ value: [p.target_gbp, targetProfit] }]
            : [];

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
                    GBP: ${Number(x).toFixed(0)}<br>
                    Profit: ${Number(y).toFixed(2)} RMB
                `;
            }
        },
        xAxis: {
            type: "value",
            name: "GBP",
            min: 0,
            max: p.max_gbp,
            interval: p.x_tick_step
        },
        yAxis: {
            type: "value",
            name: "Profit (RMB)"
        },
        series: [
            {
                name: "Min cap (50 RMB)",
                type: "line",
                showSymbol: false,
                connectNulls: false,
                data: minCapData
            },
            {
                name: "Linear 0.1% fee",
                type: "line",
                showSymbol: false,
                connectNulls: false,
                data: linearData
            },
            {
                name: "Max cap (260 RMB)",
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
                        return `Breakeven\nGBP: ${Number(params.value[0]).toFixed(0)}\nProfit: ${Number(params.value[1]).toFixed(2)} RMB`;
                    }
                }
            },
            {
                name: "Target GBP",
                type: "scatter",
                symbolSize: 12,
                data: targetPoint,
                z: 10,
                label: {
                    show: true,
                    position: "top",
                    formatter: function (params) {
                        return `Target\nGBP: ${Number(params.value[0]).toFixed(0)}\nProfit: ${Number(params.value[1]).toFixed(2)} RMB`;
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
                            return `Target x = ${Number(p.target_gbp).toFixed(0)} GBP`;
                        }
                    },
                    data: [
                        {
                            xAxis: p.target_gbp
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
