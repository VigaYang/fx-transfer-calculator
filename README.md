# FX Transfer Profit Calculator

A web-based interactive tool to evaluate whether transferring money between countries is financially beneficial after accounting for exchange rates, fees, and interest rates.

## 🌍 Overview

This project helps users compare the potential returns of holding money in different countries.

Given a transfer from one country (source currency) to another (destination currency), the calculator estimates whether the additional interest earned abroad outweighs:

* Foreign exchange (FX) conversion costs
* Transfer service fees
* Opportunity cost of leaving funds in the original country

All inputs are fully adjustable, allowing users to model different financial scenarios.

---

## ⚙️ Features

* 📈 Interactive profit curve visualization (ECharts)
* 🔍 Automatic breakeven point detection
* 🎯 Target transfer amount analysis
* 📊 Multiple fee regimes (min / linear / max fee)
* 🌐 Generalized for any currency pair (From → To)
* ⚡ Real-time updates as inputs change

---

## 🧮 Model Logic

The calculator assumes:

1. Funds start in the **source country (From currency)**
2. Money is converted via FX into the **destination currency (To currency)**
3. Funds are deposited and earn interest in the destination country
4. Profit is compared against leaving funds in the source country

### Profit Formula (simplified)

Profit =
**Interest earned in destination**
− **Interest foregone in source country**
− **Transfer and service fees**

---

## 🚀 Live Demo

👉 https://VigaYang.github.io/fx-profit-calculator/

---

## 🖥️ How to Use

1. Input:

   * FX rate (From → To)
   * Interest rates for both countries
   * Transfer fees and caps
2. Adjust:

   * Maximum transfer range
   * Target transfer amount
3. View:

   * Profit curve
   * Breakeven point(s)
   * Target point profitability

---

## 📦 Installation

Clone the repository:

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
* Comparing international interest rates

---

## ⚠️ Disclaimer

This tool is for informational purposes only and does not constitute financial advice.
Actual outcomes may vary depending on market conditions, taxes, and provider-specific fees.

---

## 📌 Future Improvements

* Live FX rate integration (API)
* Auto-filled interest rates by country
* Provider comparison (Wise, Revolut, etc.)
* Decision recommendations (“Transfer or not?”)

---

## 🤝 Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests.

---

## 📄 License

MIT License
