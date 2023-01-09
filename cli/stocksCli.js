var yahooService = require('../app/services/yahooService');
var jsonService = require('../app/services/jsonService');
var csvService = require('../app/services/csvService');
var responseTransformer = require('../app/transformer/responseTransformer');

module.exports = {
    fetchCurrentPrice: fetchCurrentPrice,
    fetchHoldings: fetchHoldings,
    fetchHistoricalPrices: fetchHistoricalPrices,
    fetchMarketSummary: fetchMarketSummary,
    fetchChart: fetchChart
};

function fetchCurrentPrice(tickers, options = {}) {
    yahooService.getCurrentPrice(tickers)
        .then((data) => {
            if (options.export === 'json') {
                jsonService.jsonExport(data);
                console.log(responseTransformer.transformExportJsonSuccess())
            } else if (options.export === 'csv') {
                csvService.csvExport(data);
                console.log(responseTransformer.transformExportCsvSuccess())
            } else {
                console.log(responseTransformer.transformCurrentPrice(data));
            }
        }).catch((error) => {
            console.log(responseTransformer.transformError(error));
        });
}

function fetchHoldings(tickers, holdings) {
    yahooService.getCurrentPrice(tickers)
        .then((data) => {
            console.log(responseTransformer.transformHoldings(data, holdings))
        }).catch((error) => {
            console.log(responseTransformer.transformError(error));
        });
}

function fetchHistoricalPrices(ticker, options) {
    yahooService.getHistoricalPrices(ticker, options)
        .then((data) => {
            if (options.export === 'json') {
                jsonService.jsonExport(data);
                console.log(responseTransformer.transformExportJsonSuccess())
            } else if (options.export === 'csv') {
                csvService.csvExport(data);
                console.log(responseTransformer.transformExportCsvSuccess())
            } else {
                console.log(responseTransformer.transformHistoricalPrices(data));
            }
        }).catch((error) => {
            console.log(responseTransformer.transformError(error));
        });
}

function fetchMarketSummary(options) {
    yahooService.getMarketSummary(options)
        .then((data) => {
            if (options.export === 'json') {
                jsonService.jsonExport(data);
                console.log(responseTransformer.transformExportJsonSuccess())
            } else if (options.export === 'csv') {
                csvService.csvExport(data);
                console.log(responseTransformer.transformExportCsvSuccess())
            } else {
                console.log(responseTransformer.transformMarketSummary(data));
            }
        }).catch((error) => {
            console.log(responseTransformer.transformError(error));
        });
}

function fetchChart(ticker) {
    yahooService.getChart(ticker)
        .then((data) => {
            responseTransformer.transformChart(data);
        }).catch((error) => {
            console.log(responseTransformer.transformError(error));
        });
}