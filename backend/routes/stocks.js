const express = require('express');
const axios = require('axios');
const Stock = require('../models/Stock');
const router = express.Router();

// helper to fetch quote from Polygon
async function fetchQuote(symbol){
    const key = process.env.POLYGON_API_KEY;
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${key}`;
    const resp = await axios.get(url);
    const item = resp.data.results[0];
    console.log(item)
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
    const stocks = await Stock.find({user: req.user}).sort('symbol');
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
    const stock = new Stock({ 
      user: req.user,
      symbol: symbol.toUpperCase().trim() 
    });
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
    await Stock.findOneAndDelete({user : req.user, symbol : symbol.toUpperCase()});
    res.sendStatus(204);
});

// GET historical prices for a symbol 
router.get('/:symbol/history', async(req, res) => {
  try{
    const{ symbol } = req.params;
    const days = parseInt(req.query.days || '7', 10);
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    const key = process.env.POLYGON_API_KEY;
    const start = from.toISOString().split('T')[0];
    const end = to.toISOString().split('T')[0];
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${start}/${end}?adjusted=true&apiKey=${key}`;
    const resp = await axios.get(url);
    const history = (resp.data.results || []).map(d => ({
      date:new Date(d.t).toISOString().split('T')[0],
      close: d.c
    }));
    res.json(history);
  }
  catch(err){
    console.error('Error fetching history: ', err.message);
    res.status(500).json({error: 'Failed to load history'});
  }
})

module.exports = router;
