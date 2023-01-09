var Table = require('cli-table3');
var colors = require('colors');
colors.enable();
var blessed = require('blessed');
var contrib = require('blessed-contrib');
var AU = require('ansi_up');

module.exports = {
  transformCurrentPrice: transformCurrentPrice,
  transformHoldings: transformHoldings,
  transformHistoricalPrices: transformHistoricalPrices,
  transformMarketSummary: transformMarketSummary,
  transformError: transformError,
  transformChart: transformChart,
  transformExportJsonSuccess: transformExportJsonSuccess,
  transformExportCsvSuccess: transformExportCsvSuccess,
};

function transformChart(data) {
  var time = data.timestamp.map((t) => { return new Date(t * 1000).toLocaleString('en-UK', { hour: 'numeric', minute: 'numeric', hour12: true }) });

  const screen = blessed.screen()
  const line = contrib.line(
    {
      style:
      {
        line: "yellow",
        text: "green",
        baseline: "black"
      },
      xLabelPadding: 3,
      xPadding: 5,
      label: 'ITC'
    }), linedata = {
      x: time,
      y: data.indicators.quote[0].volume
    }

  screen.append(line)
  line.setData([linedata])
  screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });
  screen.render();
}

function transformMarketSummary(array) {
  var table = new Table({
    head: [
      colors.yellow('Stock Name'),
      colors.yellow('Current Price'),
      colors.yellow('Change'),
      colors.yellow('% Change'),
      colors.yellow('Date')
    ],
    style: {
      head: []
    },
  });

  array.forEach((data) => {
    table.push(
      [
        data.shortName,
        colors.cyan(data.price),
        (data.change < 0) ? colors.red(data.change) : colors.green(data.change),
        (data.changePercent < 0) ? colors.red(data.changePercent + '%') : colors.green(data.changePercent + '%'),
        colors.grey(new Date(Number(data.atDate * 1000)).toJSON().split("T")[0]),
      ]
    );
  });

  return '\n' + table.toString() + '\n'
    + colors.yellow(`TIP: You can view historical prices by: curl terminal-stocks.shashi.dev/historical/ITC.NS\n\n`)
    + colors.blue.dim(`DISCLAIMER: For information purpose. Do not use for trading.\n`
      + colors.yellow.dim(`[twitter: @imSPG] [Github: https://github.com/shweshi/terminal-stocks]\n\n`));
}

function transformCurrentPrice(data) {
  var table = new Table({
    head: [
      colors.yellow('Stock Name'),
      colors.yellow('Current Price'),
      colors.yellow('Change'),
      colors.yellow('% Change'),
      colors.yellow('Day Range'),
      colors.yellow('52 Week Range')
    ],
    style: {
      head: []
    },
  });

  for (let i = 0; i < data.length; i++) {
    const hex = (data[i].change > 0) ? '008000' : 'FF0000';
    table.push(
      [
        data[i].longName,
        colors.cyan(data[i].price),
        (data[i].change < 0) ? colors.red(data[i].change) : colors.green(data[i].change),
        (data[i].changePercent < 0) ? colors.red(data[i].changePercent) : colors.green(data[i].changePercent),
        data[i].dayRange,
        data[i].fiftyTwoWeekRange,
      ]
    );
  }

  return '\n' + table.toString() + '\n' + colors.grey(colors.grey(data[0].atDate)) + '\n\n'
    + colors.yellow(`TIP: You can view historical prices by: curl terminal-stocks.shashi.dev/historical/${data[0].ticker}\n\n`)
    + colors.blue.dim(`DISCLAIMER: For information purpose. Do not use for trading.\n`
      + colors.yellow.dim(`[twitter: @imSPG] [Github: https://github.com/shweshi/terminal-stocks]\n\n`));
}

String.prototype.float = function() {
    return parseFloat(this.replaceAll(',', ''));
}

function transformHoldings(data, holdings) {
  var table = new Table({
    head: [
      colors.yellow('Stock Name'),
      colors.yellow('Current Price'),
      colors.yellow('Holdings'),
      colors.yellow('Balance'),
      colors.yellow('Change'),
      colors.yellow('% Change'),
      colors.yellow('Day Range'),
      colors.yellow('52 Week Range')
    ],
    style: {
      head: []
    },
  });

  for (let i = 0; i < data.length; i++) {
    var holding = holdings[data[i].ticker]
    table.push(
      [
        data[i].longName,
        colors.cyan(data[i].price),
        colors.cyan(String(holding)),
        colors.cyan(String(new Intl.NumberFormat().format(data[i].price.float() * holding))),
        (data[i].change < 0) ? colors.red(data[i].change) : colors.green(data[i].change),
        (data[i].changePercent < 0) ? colors.red(data[i].changePercent) : colors.green(data[i].changePercent),
        data[i].dayRange,
        data[i].fiftyTwoWeekRange,
      ]
    );
  }

  return '\n' + table.toString() + '\n' + colors.grey(data[0].atDate) + '\n\n';
}

function transformHistoricalPrices(data) {
  const hex = (data.change > 0) ? '008000' : 'FF0000';

  var table = new Table({
    head: [
      colors.yellow('Date'),
      colors.yellow('Open'),
      colors.yellow('High'),
      colors.yellow('Low'),
      colors.yellow('Close*'),
      colors.yellow('Adj Close**'),
      colors.yellow('Volume')
    ],
    style: {
      head: []
    },
  });

  data.array.forEach((price) => {
    table.push(
      [
        new Date(Number(price.date * 1000)).toJSON().split("T")[0],
        parseFloat(price.open).toFixed(2),
        parseFloat(price.high).toFixed(2),
        parseFloat(price.low).toFixed(2),
        parseFloat(price.close).toFixed(2),
        parseFloat(price.adjclose).toFixed(2),
        price.volume
      ]
    );
  })

  return `Name: ${data.longName} \n\n` + table.toString() + '\n'
    + colors.yellow(`By default it show 10 entries to see the next entries make next call with ?page=2 and next with ?page=3\n\n`)
    + colors.blue(`* Close price adjusted for splits.\n** Adjusted close price adjusted for both dividends and splits.\n\n`)
    + colors.yellow(`TIP: You can view current price by: curl terminal-stocks.shashi.dev/${data.ticker}\n\n`)
    + colors.blue.dim(`DISCLAIMER: For information purpose. Do not use for trading.\n`
      + colors.yellow.dim(`[twitter: @imSPG] [Github: https://github.com/shweshi/terminal-stocks]\n`));
}

function transformError(error) {
  return `\nSorry, we couldn't find. Please check the stock ticker and provide correct one.\n\n ${error.message}`;
}

function transformExportJsonSuccess() {
  return `\nExported to json successfully.\nStored in: ${process.cwd()}\n`;
}

function transformExportCsvSuccess() {
  return `\nExported to csv successfully.\nStored in: ${process.cwd()}\n`;
}