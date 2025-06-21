const express = require('express');
const axios = require('axios');
const Stock = require('../models/Stock');
const router = express.Router();

// helper to fetch quote from Alpha Vantage
async function fetchQuote(symbol){
    const key = process.env.POLYGON_API_KEY;
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${key}`;
    const resp = await axios.get(url);
    const item = resp.data.results[0];
    return {
        symbol,
        price: item.c,                            // last close
        change: item.c - item.o,                  // last close minus open
        changePct: ((item.c - item.o) / item.o) * 100
    };
}

// GET all tracked stocks with live quotes
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find().sort('symbol');
    const quotes = [];

    for (let { symbol } of stocks) {
      try {
        quotes.push(await fetchQuote(symbol));
      } catch (err) {
        console.error(`⚠️ fetchQuote failed for ${symbol}:`, err.message);
        // push a placeholder so the client still gets back an array
        quotes.push({ symbol, price: null, change: null, changePct: null });
      }
    }

    res.json(quotes);
  } catch (err) {
    console.error('🔥 Error in GET /api/stocks:', err);
    res.status(500).json({ error: 'Failed to load stocks' });
  }
});


//POST add a new symbol
router.post('/', async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    // normalize and save
    const stock = new Stock({ symbol: symbol.toUpperCase().trim() });
    await stock.save();

    res.status(201).json(stock);
  } catch (err) {
    // duplicate‐key (already tracking this symbol)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'That symbol is already in your watchlist.' });
    }
    console.error('Error saving stock:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//DELETE a symbol
router.delete('/:symbol', async(req, res) => {
    const { symbol } = req.params;
    await Stock.findOneAndDelete({symbol : symbol.toUpperCase()});
    res.sendStatus(204);
});

module.exports = router;
