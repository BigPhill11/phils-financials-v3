const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const apiKey = process.env.FMP_API_KEY;
  const url = `https://financialmodelingprep.com/api/v3/economic_calendar?apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const events = data.slice(0, 10).map(event => ({
      date: event.date,
      event: event.event,
      country: event.country,
      actual: event.actual,
      previous: event.previous,
      consensus: event.consensus
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(events)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch economic calendar.' })
    };
  }
};
