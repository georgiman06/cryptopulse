import "./globals.css";

export const metadata = {
  title: "FinPulse — Live Market Data",
  description: "Real-time crypto, stocks and ETF dashboard powered by Databricks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}