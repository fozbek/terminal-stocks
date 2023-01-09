#!/usr/bin/env node

const stocksCli = require('../cli/stocksCli')

var argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('Usage: $0 -ticker [string] --historical [boolean]')
    .example('$0 -ticker <ticker> --historical', 'returns the price information of given ticker')
    .usage('Usage: $0 -market [boolean]')
    .example('$0 -market', 'returns the market summary')
    .usage('Usage: $0 --tickers [comma separated string]')
    .example('$0 --tickers <tickers>', 'returns the price information for given tickers')
    .alias('t', 'ticker')
    .describe('t', 'Ticker of the stock from yahoo finance')
    .alias('m', 'market')
    .describe('m', 'Fetch market summary from yahoo finance')
    .alias('c', 'chart')
    .describe('c', 'Fetch chart for given ticker')
    .describe('historical', 'To get historical price information of the stock')
    .describe('json', 'To export the data as json')
    .describe('csv', 'To export the data csv')
    .help('h')
    .alias('h', 'help')
    .alias('v', 'version')
    .argv;

const options = {};

if (argv.json) {
    options.export = 'json';
} else if (argv.csv) {
    options.export = 'csv';
}

if (argv.holdings) {
    const holdings = {
        'BNB-USD': 13.13,
        'SISE.IS': 263,
        'SAYAS.IS': 276,
    }
    stocksCli.fetchHoldings(Object.keys(holdings), holdings);
}

if (argv.tickers) {
    const tickers = argv.tickers.split(',');
    stocksCli.fetchCurrentPrice(tickers, options);
}

if (argv.market) {
    stocksCli.fetchMarketSummary(options, options);
} else if (argv.t || argv.ticker) {
    const ticker = argv.t || argv.ticker;
    if (argv.historical) {
        stocksCli.fetchHistoricalPrices(ticker, { page: 1, limit: 10, export: options.export });
    } else if (argv.chart) {
        stocksCli.fetchChart(ticker);
    } else {
        stocksCli.fetchCurrentPrice([ticker], options);
    }
}