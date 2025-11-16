import yfinance as yf
import gspread
import pandas as pd

# -------------------------
# Google Sheets connection
# -------------------------
client = gspread.service_account(filename="credentials.json")

# Open workbook
spreadsheet = client.open("My Portfolio Tracker")

# -------------------------
# Update Stocks Sheet
# -------------------------
def update_stocks():
    sheet = spreadsheet.worksheet("Stocks")
    data = sheet.get_all_records()
    df = pd.DataFrame(data)

    for i, row in df.iterrows():
        ticker = str(row["Ticker"]).strip()
        qty = float(row["Qty"]) if pd.notna(row["Qty"]) else 0
        entry_price = float(row["Entry Price"]) if pd.notna(row["Entry Price"]) else 0

        if not ticker or qty == 0:
            continue

        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="1d")
            
            if hist.empty:
                print(f"⚠️ No price data found for {ticker}")
                continue
                
            current_price = float(hist["Close"].iloc[-1])

            market_value = current_price * qty
            pnl_dollar = (current_price - entry_price) * qty
            pnl_percent = (pnl_dollar / (entry_price * qty)) * 100 if entry_price > 0 else 0

            # Update sheet
            sheet.update_cell(i + 2, 5, round(current_price, 2))  # Current Price
            sheet.update_cell(i + 2, 6, round(market_value, 2))   # Market Value
            sheet.update_cell(i + 2, 7, round(pnl_dollar, 2))     # P&L $
            sheet.update_cell(i + 2, 8, round(pnl_percent, 2))    # P&L %

            print(f"✅ Updated Stock: {ticker} | Price: {current_price}")
        except Exception as e:
            print(f"❌ Error updating stock {ticker}: {e}")

# -------------------------
# Update Options Sheet
# -------------------------
def update_options():
    sheet = spreadsheet.worksheet("Options")
    data = sheet.get_all_records()
    df = pd.DataFrame(data)

    for i, row in df.iterrows():
        ticker = str(row["Ticker"]).strip()
        strike = float(row["Strike"]) if pd.notna(row["Strike"]) else None
        expiry = str(row["Expiry"]).strip() if pd.notna(row["Expiry"]) else None
        option_type = str(row["Option type (Call/Put)"]).upper().strip() if pd.notna(row["Option type (Call/Put)"]) else ""
        contracts = float(row["Contracts Qty"]) if pd.notna(row["Contracts Qty"]) else 0
        entry_price = float(row["Entry Price"]) if pd.notna(row["Entry Price"]) else 0

        if not ticker or strike is None or not expiry or not option_type or contracts == 0:
            continue

        try:
            stock = yf.Ticker(ticker)

            # Option symbol format
            opt_chain = stock.option_chain(expiry)
            options_df = opt_chain.calls if option_type == "CALL" else opt_chain.puts

            option_row = options_df[options_df["strike"] == strike]

            if option_row.empty:
                print(f"⚠️ No option data found for {ticker} {strike} {option_type} {expiry}")
                continue

            current_price = float(option_row["lastPrice"].values[0]) if pd.notna(option_row["lastPrice"].values[0]) else 0

            # Greeks and IV
            iv = float(option_row["impliedVolatility"].values[0]) if "impliedVolatility" in option_row.columns and pd.notna(option_row["impliedVolatility"].values[0]) else None
            delta = float(option_row["delta"].values[0]) if "delta" in option_row.columns and pd.notna(option_row["delta"].values[0]) else None
            gamma = float(option_row["gamma"].values[0]) if "gamma" in option_row.columns and pd.notna(option_row["gamma"].values[0]) else None
            theta = float(option_row["theta"].values[0]) if "theta" in option_row.columns and pd.notna(option_row["theta"].values[0]) else None
            vega = float(option_row["vega"].values[0]) if "vega" in option_row.columns and pd.notna(option_row["vega"].values[0]) else None

            market_value = current_price * contracts * 100  # 1 contract = 100 shares
            pnl_dollar = (current_price - entry_price) * contracts * 100
            pnl_percent = (pnl_dollar / (entry_price * contracts * 100)) * 100 if entry_price > 0 else 0

            # Update sheet
            sheet.update_cell(i + 2, 9, round(current_price, 2))    # Current Price
            sheet.update_cell(i + 2, 10, round(market_value, 2))    # Market Value
            sheet.update_cell(i + 2, 11, delta if delta is not None else "")  # Delta
            sheet.update_cell(i + 2, 12, gamma if gamma is not None else "")  # Gamma
            sheet.update_cell(i + 2, 13, theta if theta is not None else "")  # Theta
            sheet.update_cell(i + 2, 14, vega if vega is not None else "")   # Vega
            sheet.update_cell(i + 2, 15, iv if iv is not None else "")       # IV
            sheet.update_cell(i + 2, 16, round(pnl_dollar, 2))               # P&L $
            sheet.update_cell(i + 2, 17, round(pnl_percent, 2))              # P&L %

            print(f"✅ Updated Option: {ticker} {strike} {option_type} | Price: {current_price}")
        except Exception as e:
            print(f"❌ Error updating option {ticker}: {e}")

# -------------------------
# Run updates
# -------------------------
if __name__ == "__main__":
    print("🔄 Updating Stocks...")
    update_stocks()
    print("🔄 Updating Options...")
    update_options()
    print("✅ All updates complete!")