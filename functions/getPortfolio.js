const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.FMP_API_KEY;
  const symbol = event.queryStringParameters.symbol || 'AAPL';

  try {
    const [profileRes, quoteRes, keyMetricsRes] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`),
      fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?limit=1&apikey=${apiKey}`)
    ]);

    const profile = await profileRes.json();
    const quote = await quoteRes.json();
    const metrics = await keyMetricsRes.json();

    const company = profile[0] || {};
    const price = quote[0]?.price || 'N/A';
    const percent_change = quote[0]?.changesPercentage || 'N/A';
    const kpi = metrics[0] || {};

    return {
      statusCode: 200,
      body: JSON.stringify({
        symbol,
        price,
        percent_change,
        revenue_growth: kpi.revenueGrowth,
        eps: kpi.eps,
        roe: kpi.roe,
        debt_to_equity: kpi.debtToEquity,
        ebitda: kpi.ebitda,
        summary: company.description || "No summary available."
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch portfolio data.' })
    };
  }
};
