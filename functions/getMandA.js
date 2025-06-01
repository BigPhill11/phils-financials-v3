const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.FMP_API_KEY;
  const url = `https://financialmodelingprep.com/api/v3/ipo_calendar?apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const ipos = data.slice(0, 10).map(ipo => ({
      company: ipo.company,
      symbol: ipo.symbol,
      date: ipo.date,
      priceRange: ipo.priceRange,
      exchange: ipo.exchange,
      status: ipo.status
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(ipos)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch IPO data.' })
    };
  }
};
