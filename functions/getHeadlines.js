const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.FMP_API_KEY;
  const url = `https://financialmodelingprep.com/api/v3/stock_news?limit=7&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const headlines = data.map(article => ({
      title: article.title,
      summary: article.text,
      source: article.url
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(headlines)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch headlines.' })
    };
  }
};
