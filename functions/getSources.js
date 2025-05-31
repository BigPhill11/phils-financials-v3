exports.handler = async (event, context) => {
  const sources = [
    {
      title: "S&P 500 rises on strong earnings",
      url: "https://www.reuters.com/markets/us/sp500-strong-earnings-2024",
      date: "2024-06-01"
    },
    {
      title: "Fed rate decision looms",
      url: "https://www.wsj.com/economy/fed-rate-decision-2024",
      date: "2024-06-01"
    },
    {
      title: "Recent IPOs outperform expectations",
      url: "https://www.bloomberg.com/news/articles/recent-ipos-2024",
      date: "2024-06-01"
    }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(sources)
  };
};
