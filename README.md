# FX Transfer Profit Calculator

A web-based interactive tool to evaluate whether transferring money between countries is financially beneficial after accounting for exchange rates, fees, and interest rates.

---

## 🌍 Overview

This tool helps users compare the financial outcome of transferring money from one country (**source currency**) to another (**destination currency**).

It estimates whether the additional interest earned abroad outweighs:

* Foreign exchange (FX) conversion costs
* Transfer and service fees
* Receiving bank fees in the destination country
* Opportunity cost of leaving funds in the source country

All inputs are adjustable, making the tool applicable to any currency pair.

---

## ⚙️ Features

* 📈 Interactive profit curve (ECharts)
* 🔍 Automatic breakeven point detection
* 🎯 Target amount profitability analysis
* 📊 Fee structure modeling:

  * Percentage service fee (with min/max caps)
  * Fixed transfer fee (source side)
  * Receiving bank fee (destination side)
* 🌐 Generalised for any **From → To** currency scenario
* ⚡ Real-time updates on input changes

---

## 🧮 Model Logic

The calculation is implemented in:

```javascript
function netGainForAmount(amountToCurrency, p)
```

### Key Assumptions

1. You start with funds in the **source currency**
2. You convert to the **destination currency**
3. You earn interest in the destination country
4. Results are expressed in **source-currency equivalent**

---

### Step-by-step Calculation

#### 1. FX Conversion Cost

```text
fx_cost = amountToCurrency × fx_rate
```

---

#### 2. Service Fee (with caps)

```text
raw_fee = service_rate × fx_cost
service_fee = bounded by [min_cap, max_cap]
```

---

#### 3. Receiving Bank Fee (converted)

```text
to_fee_in_from = to_fee × fx_rate
```

---

#### 4. Total Fees

```text
total_fees = service_fee + fixed_fee + to_fee_in_from
```

---

#### 5. Total Outlay (source currency)

```text
outlay = fx_cost + total_fees
```

---

#### 6. Interest Earned in Destination

```text
interest_to = amountToCurrency × to_interest × fx_rate
```

---

#### 7. Interest if Funds Stayed in Source Country

```text
interest_from = outlay × from_interest
```

---

#### 8. Final Profit

```text
profit = interest_to − interest_from
```

✅ Fees are **only counted once** via `outlay`
❌ No double subtraction

---

## 📊 Chart Interpretation

* **X-axis**: Amount in destination currency
* **Y-axis**: Profit (in source currency equivalent)

### Lines

* Min fee regime
* Linear fee regime
* Max fee regime

### Markers

* **Breakeven points** → where profit = 0
* **Target amount** → user-defined scenario
* **Vertical line** → highlights target amount

---

## 🚀 Live Demo

👉 https://VigaYang.github.io/fx-profit-calculator/

---

## 🖥️ How to Use

1. Input:

   * FX rate (From → To)
   * Interest rates (source and destination)
   * Service fee parameters (rate, min, max)
   * Fixed transfer fee (source currency)
   * Receiving bank fee (destination currency)

2. Adjust:

   * Maximum amount range
   * X-axis tick spacing
   * Target transfer amount

3. Analyse:

   * Profit curve
   * Breakeven point(s)
   * Profit at your target amount

---

## 📦 Installation

```bash
git clone https://github.com/VigaYang/fx-profit-calculator.git
```

Open `index.html` in your browser.

---

## 🌐 Deployment (GitHub Pages)

1. Go to **Settings → Pages**
2. Select branch: `main`
3. Root directory `/`
4. Save

Your site will be available at:

```
https://VigaYang.github.io/fx-profit-calculator/
```

---

## 💡 Use Cases

* Cross-border savings decisions
* FX transfer optimisation
* Expat financial planning
* Comparing international interest advantages

---

## ⚠️ Disclaimer

This tool is for informational purposes only and does not constitute financial advice.
Actual outcomes may vary depending on market conditions, taxes, and provider-specific fees.

---

## 📌 Future Improvements

* Live FX rate integration (API)
* Auto-filled interest rates by country
* Transfer provider comparison (Wise, Revolut, etc.)
* Decision recommendation (e.g. “Transfer above X amount”)
* Cost breakdown panel (fees vs interest impact)

---

## 🤝 Contributing

Contributions are welcome for non-commercial purposes.
Please open issues or submit pull requests.

---

## 📄 License

This project is licensed under a **Non-Commercial License**.

You are free to use, modify, and share this project for personal and educational purposes.

**Commercial use is strictly prohibited without prior written permission from the author.**

See the [LICENSE](./LICENSE) file for full details.
