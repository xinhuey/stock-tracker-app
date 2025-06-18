const express = require('express');
const axios = require('axios');
const Stock = require('../models/Stock');
const router = express.Router();

// helper to fetch quote from Alpha Vantage
async function fetchQuote(symbol){
    const key = process.env.ALPHA_VANTAHE_KEY;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`;
    const resp = await axios.get(url);
    const data = resp.data['Global Quote'];
    console.log(symbol, JSON.stringify(resp.data, null, 2));
    if (!data || Object.keys(data).length === 0){
        throw new Error(`No data returned for symbol ${symbol}`);
    }
    return {
        symbol: data['01. symbol'],
        price: parseFloat(data['0.5. price']),
        change: parseFloat(data['0.9. change']),
        changePct: parseFloat(data['10. change percent'])
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
