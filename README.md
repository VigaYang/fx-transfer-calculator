# FX Transfer Profit Calculator

A web-based interactive tool to evaluate whether transferring money between countries is financially beneficial after accounting for exchange rates, fees, and interest rates.

## 🌍 Overview

This project helps users compare the potential returns of holding money in different countries.

Given a transfer from one country (source currency) to another (destination currency), the calculator estimates whether the additional interest earned abroad outweighs:

* Foreign exchange (FX) conversion costs
* Transfer service fees
* Receiving bank fees in the destination country
* Opportunity cost of leaving funds in the original country

All inputs are fully adjustable, allowing users to model different financial scenarios across any currency pair.

---

## ⚙️ Features

* 📈 Interactive profit curve visualization (ECharts)
* 🔍 Automatic breakeven point detection
* 🎯 Target transfer amount analysis
* 📊 Multiple fee regimes (min / linear / max fee)
* 🌐 Generalised for any currency pair (From → To)
* 💸 Separate handling of:

  * Transfer fees (source currency)
  * Receiving bank fees (destination currency)
* ⚡ Real-time updates as inputs change

---

## 🧮 Model Logic

The calculator assumes:

1. Funds start in the **source country (From currency)**
2. Money is converted via FX into the **destination currency (To currency)**
3. Funds are deposited and earn interest in the destination country
4. Profit is compared against leaving funds in the source country

### Profit Formula (conceptual)

Profit =
**Interest earned in destination (converted back)**
− **Interest foregone in source country**
− **All transfer-related fees**

### Fee Structure

* Service fee (percentage, with min/max caps)
* Fixed transfer fee (source side)
* Receiving bank fee (destination side, converted via FX)

---

## 🚀 Live Demo

👉 https://VigaYang.github.io/fx-profit-calculator/

---

## 🖥️ How to Use

1. Enter:

   * FX rate (From → To)
   * Interest rates for both countries
   * Service fee parameters (rate, min, max)
   * Fixed transfer fee (source currency)
   * Receiving bank fee (destination currency)

2. Adjust:

   * Maximum transfer range
   * X-axis tick spacing
   * Target transfer amount

3. Analyse:

   * Profit curve
   * Breakeven point(s)
   * Profitability at your target amount

---

## 📦 Installation

Clone the repository:

```bash id="k2e1w3"
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
* Comparing international interest rate advantages

---

## ⚠️ Disclaimer

This tool is for informational purposes only and does not constitute financial advice.
Actual outcomes may vary depending on market conditions, taxes, and provider-specific fees.

---

## 📌 Future Improvements

* Live FX rate integration (API)
* Auto-filled interest rates by country
* Provider comparison (Wise, Revolut, etc.)
* Decision recommendation (“Transfer or not?”)
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
