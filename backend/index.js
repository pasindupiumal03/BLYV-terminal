const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const SOLANA_TRACKER_API_KEY = process.env.SOLANA_TRACKER_API_KEY;
const SOLANA_TRACKER_API_URL = "https://data.solanatracker.io";

app.post("/api/solana-token-info", async (req, res) => {
  let tokenData, chartData;
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Missing token address" });
  }

  try {
    // Fetch token data
    data = await axios.get(`${SOLANA_TRACKER_API_URL}/tokens/${address}`, {
      headers: { "x-api-key": SOLANA_TRACKER_API_KEY },
    });
    tokenData = data.data;

    // Optional: check if the token exists
    if (!data) {
      return res.json({
        found: false,
        message: `Couldn't find details for token address ${address}. Might be too new or not listed.`,
      });
    }

    // 3-second delay before second API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Attempt to extract chart data if available (this is hypothetical unless you have a real chart endpoint)
    chartData = null;
    try {
      const chartRes = await axios.get(
        `${SOLANA_TRACKER_API_URL}/chart/${address}`,
        {
          headers: { "x-api-key": SOLANA_TRACKER_API_KEY },
        }
      );
      chartData = chartRes.data.oclhv;
    } catch (chartErr) {
      console.warn("Chart data not available or endpoint doesn't exist.");
    }

    const pool = tokenData.pools?.[0];
    const token = {
      name: tokenData.token?.name || "Unknown",
      address: tokenData.token?.mint,
      price: pool?.price?.usd || null,
      change24h: tokenData.events?.["24h"]?.priceChangePercentage || null,
      marketCap: pool?.marketCap?.usd || null,
      volume24h: pool?.txns?.volume || null,
      creator: pool?.deployer || null,
      symbol: tokenData.token?.symbol,
      decimals: tokenData.token?.decimals,
      image: tokenData.token?.image || null,
    };

    return res.json({
      found: true,
      token: token,
      chart: chartData,
      message: (
        `Alright, another BLYV token address: ${token.address}. Let's check this one out on the BLYV platform.\n` +
        `Alright, let's look at ${token.address}. This is ${token.name} (${token.symbol}), the mascot of BLYV.\n` +
        `Here's the lowdown:\n` +
        `Market Cap: ${token.marketCap || "N/A"}\n` +
        `24h Volume: ${token.volume24h || "N/A"}\n` +
        `24h Change: ${token.change24h || "N/A"}%.\n` +
        `The chart data shows some recent price action, bouncing around a bit.\n` +
        `It's the BLYV mascot, so there's that. Volume and market cap are decent for a BLYV token, but that 24h drop in volume and market cap change is something to note. Do your own research, don't just ape in because it's the mascot.`
      ),
    });
  } catch (error) {
    console.error(
      "Error fetching token info:",
      error?.response?.data || error.message
    );
    return res.status(500).json({
      found: false,
      message: `Something went wrong while fetching data for token address ${address}. Try again later.`,
      error: error?.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
