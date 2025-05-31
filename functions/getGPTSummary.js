const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const openaiKey = process.env.OPENAI_API_KEY;

  const prompt = `
Act as a financial analyst for a student-friendly finance app.
Write a brief, easy-to-understand multi-paragraph market summary based on today's major news and economic trends.
At the end, provide a TL;DR summary in one sentence.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.7
      })
    });

    const data = await response.json();

    let text = data.choices?.[0]?.message?.content || "No summary generated.";
    let [ ...paragraphs ] = text.split(/\n+/).filter(Boolean);
    let tldr = paragraphs.pop();
    if (!tldr.toLowerCase().startsWith("tl;dr")) tldr = "TL;DR: " + tldr;

    return {
      statusCode: 200,
      body: JSON.stringify({
        paragraphs,
        tldr
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch GPT summary." })
    };
  }
};
