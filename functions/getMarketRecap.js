const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.FMP_API_KEY;
  const url = `https://financialmodelingprep.com/api/v3/quotes/index?apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Example: Return 6 major indexes (edit symbols as needed)
    const indexes = data.filter(idx =>
      ["SPX", "DJI", "IXIC", "RUT", "VIX", "INX"].includes(idx.symbol)
    ).map(idx => ({
      symbol: idx.symbol,
      name: idx.name,
      price: idx.price,
      change: idx.change,
      changesPercentage: idx.changesPercentage
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(indexes)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch market data.' })
    };
  }
};
