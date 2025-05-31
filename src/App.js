import React, { useState, useEffect } from "react";

const tabs = [
  { id: "market", label: "Market Recap" },
  { id: "headlines", label: "Headlines" },
  { id: "econ", label: "Econ Calendar" },
  { id: "manda", label: "M&A/IPOs" },
  { id: "portfolio", label: "Portfolio" },
  { id: "learn", label: "Learn" },
  { id: "sources", label: "Sources" },
  { id: "gptsummary", label: "GPT Summary" },
];

function TabButton({ tab, activeTab, setActiveTab }) {
  return (
    <button
      className={`py-2 px-4 m-1 rounded ${
        activeTab === tab.id
          ? "bg-green-600 text-white"
          : "bg-green-100 text-green-800"
      }`}
      onClick={() => setActiveTab(tab.id)}
    >
      {tab.label}
    </button>
  );
}

function Section({ id, activeTab, children }) {
  return activeTab === id ? <div className="p-4">{children}</div> : null;
}

function App() {
  const [activeTab, setActiveTab] = useState("market");
  const [marketRecap, setMarketRecap] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [econ, setEcon] = useState([]);
  const [mandA, setMandA] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [sources, setSources] = useState([]);
  const [gpt, setGpt] = useState({ paragraphs: [], tldr: "" });

  // Demo stocks for portfolio tab
  const trackedStocks = ["AAPL", "GOOGL"];

  useEffect(() => {
    fetch("/.netlify/functions/getMarketRecap")
      .then((r) => r.json())
      .then(setMarketRecap);

    fetch("/.netlify/functions/getHeadlines")
      .then((r) => r.json())
      .then(setHeadlines);

    fetch("/.netlify/functions/getEconCalendar")
      .then((r) => r.json())
      .then(setEcon);

    fetch("/.netlify/functions/getMandA")
      .then((r) => r.json())
      .then(setMandA);

    // Portfolio: just show first stock
    fetch(`/.netlify/functions/getPortfolio?symbol=${trackedStocks[0]}`)
      .then((r) => r.json())
      .then(setPortfolio);

    fetch("/.netlify/functions/getSources")
      .then((r) => r.json())
      .then(setSources);

    fetch("/.netlify/functions/getGPTSummary")
      .then((r) => r.json())
      .then(setGpt);
  }, [trackedStocks]);

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f5f7fa", minHeight: "100vh" }}>
      <header style={{ textAlign: "center", padding: "1.5rem 0" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "2.4rem", color: "#16a34a", letterSpacing: "1px" }}>
          Phil's Financials
        </h1>
        <div style={{ marginTop: "1rem" }}>
          {tabs.map((tab) => (
            <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
          ))}
        </div>
      </header>

      {/* Market Recap */}
      <Section id="market" activeTab={activeTab}>
        <h2 className="font-bold text-xl mb-2">Market Recap</h2>
        {marketRecap.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {marketRecap.map((idx) => (
              <li key={idx.symbol}>
                <b>{idx.name}</b> ({idx.symbol}): {idx.price} ({idx.change}, {idx.changesPercentage}%)
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Headlines */}
      <Section id="headlines" activeTab={activeTab}>
        <h2 className="font-bold text-xl mb-2">Headlines</h2>
        {headlines.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {headlines.map((hl, i) => (
              <li key={i} className="mb-2">
                <b>{hl.title}</b>
                <div style={{ fontSize: "0.95rem" }}>{hl.summary}</div>
                <a href={hl.source} target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a" }}>
                  Source
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Economic Calendar */}
      <Section id="econ" activeTab={activeTab}>
        <h2 className="font-bold text-xl mb-2">Economic Calendar</h2>
        {econ.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: "100%", fontSize: "0.95rem" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Country</th>
                <th>Actual</th>
                <th>Previous</th>
                <th>Consensus</th>
              </tr>
            </thead>
            <tbody>
              {econ.map((ev, i) => (
                <tr key={i}>
                  <td>{ev.date}</td>
                  <td>{ev.event}</td>
                  <td>{ev.country}</td>
                  <td>{ev.actual}</td>
                  <td>{ev.previous}</td>
                  <td>{ev.consensus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* M&A and IPOs */}
      <Section id="manda" activeTab={activeTab}>
        <h2 className="font-bold text-xl mb-2">Recent IPOs</h2>
        {mandA.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {mandA.map((ipo, i) => (
              <li key={i}>
                <b>{ipo.company}</b> ({ipo.symbol}) — {ipo.date}, {ipo.exchange}, {ipo.priceRange}, {ipo.status}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Portfolio */}
      <Section id="portfolio" activeTab={activeTab}>
        <h2 className="font-bold text-xl mb-2">Portfolio</h2>
        {portfolio == null ? (
          <p>Loading...</p>
        ) : (
          <ul>
            <li>
              <b>{portfolio.symbol}</b> — Price: {portfolio.price}, Change: {portfolio.percent_change}%
            </li>
            <li>Revenue Growth: {portfolio.revenue_growth}</li>
            <li>EPS: {portfolio.eps}</li>
            <li>ROE: {portfolio.roe}</li>
            <li>Debt/Equity: {portfolio.debt_to_equity}</li>
            <li>EBITDA: {portfolio.ebitda}</li>
            <li>Summary: {portfolio.summary}</li>
          </ul>
        )}
      </Section>

      {/* Learn (demo placeholder) */}
      <Section id="learn" activeTab={activeTab}>
        <h2 className="font-bold text-xl mb-2">Learn</h2>
        <p>
          Welcome to the Learn tab! Here, you’ll soon find flashcards, finance term explanations, and more.
        </p>
        <ul>
          <li><b>Term of the Day:</b> EBITDA — Earnings Before Interest, Taxes, Depreciation, and Amortization.</li>
          <li><b>EPS:</b> Earnings Per Share. Net earnings divided by outstanding shares.</li>
        </ul>
      </Section>

      {/* Sources */}
      <Section id="sources" activeTab={activeTab}>
        <h2 className="font-bold text-xl mb-2">Sources</h2>
        {sources.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {sources.map((src, i) => (
              <li key={i}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a" }}>
                  {src.title}
                </a>{" "}
                ({src.date})
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* GPT Summary */}
      <Section id="gptsummary" activeTab={activeTab}>
        <h2 className="font-bold text-xl mb-2">GPT Summary</h2>
        {gpt.paragraphs.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            {gpt.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div style={{ fontWeight: "bold", color: "#16a34a", marginTop: "1em" }}>
              {gpt.tldr}
            </div>
          </>
        )}
      </Section>
    </div>
  );
}

export default App;
