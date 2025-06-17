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

    return {
        symbol: data['01. symbol'],
        price: parseFloat(data['0.5. price']),
        change: parseFloat(data['0.9. change']),
        changePct: parseFloat(data['10. change percent'])
    };
}

// GET all tracked stocks with live quotes
router.get('/', async(req, res) => {
    const stocks = await Stock.find().sort('symbol');
    const quotes = await Promise.all(stocks.map(s => fetchQuote(s.symbol)));
    res.json(quotes);
});

//POST add a new symbol
router.post('/', async(req, res) => {
    const { symbol } = req.body;
    const stock = new Stock({symbol});
    await stock.save();
    res.status(201).json.apply(stock);
});

//DELETE a symbol
router.delete('/:symbol', async(req, res) => {
    const { symbol } = req.params;
    await Stock.findOneAndDelete({symbol : symbol.toUpperCase()});
    res.sendStatus(204);
});

module.exports = router;
