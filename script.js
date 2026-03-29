function netGainForGBP(G, p) {
    const G_sent = G + p.uk_fee;
    const fx_cost = p.fx_rate * G_sent;

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

function updateChart() {
    const p = {
        fx_rate: parseFloat(document.getElementById("fx_rate").value),
        china_interest: parseFloat(document.getElementById("china_interest").value),
        uk_interest: parseFloat(document.getElementById("uk_interest").value),
        service_rate: parseFloat(document.getElementById("service_rate").value),
        min_cap: parseFloat(document.getElementById("min_cap").value),
        max_cap: parseFloat(document.getElementById("max_cap").value),
        uk_fee: parseFloat(document.getElementById("uk_fee").value)
    };

    const G_values = [];
    const green = [], blue = [], brown = [];

    for (let G = 0; G <= 100000; G += 200) {
        const result = netGainForGBP(G, p);
        G_values.push(G);

        if (result.raw_fee < p.min_cap) {
            green.push(result.profit);
            blue.push(null);
            brown.push(null);
        } else if (result.raw_fee > p.max_cap) {
            green.push(null);
            blue.push(null);
            brown.push(result.profit);
        } else {
            green.push(null);
            blue.push(result.profit);
            brown.push(null);
        }
    }

    const chart = echarts.init(document.getElementById("chart"));

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                const pnt = params.find(x => x.value !== null);
                return `
                    GBP: ${pnt.axisValue}<br>
                    Profit: ${pnt.value.toFixed(2)} RMB<br>
                    Fee regime: ${pnt.seriesName}
                `;
            }
        },
        xAxis: { type: 'category', data: G_values, name: 'GBP Received' },
        yAxis: { type: 'value', name: 'Profit (RMB)' },
        series: [
            { name: 'Min cap (50 RMB)', type: 'line', data: green, color: 'green', connectNulls: false },
            { name: 'Linear 0.1% fee', type: 'line', data: blue, color: 'blue', connectNulls: false },
            { name: 'Max cap (260 RMB)', type: 'line', data: brown, color: 'brown', connectNulls: false }
        ]
    };

    chart.setOption(option, true);
}

updateChart();
