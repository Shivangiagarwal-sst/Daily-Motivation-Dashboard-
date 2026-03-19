import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState(() => {
    const stored = localStorage.getItem("likedQuotes");
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  const fetchQuote = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `https://dummyjson.com/quotes/random?${Date.now()}`
      );

      const data = await res.json();

      setQuote(data.quote);
      setAuthor(data.author);

    } catch (err) {
      console.error(err);
      setQuote("Could not fetch quote.");
      setAuthor("");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const toggleLike = () => {
    const exists = likedQuotes.some((q) => q.quote === quote);

    if (exists) {
      setLikedQuotes((prev) =>
        prev.filter((q) => q.quote !== quote)
      );
    } else {
      setLikedQuotes((prev) => [
        ...prev,
        { quote, author },
      ]);
    }
  };
  const isLiked = likedQuotes.some((q) => q.quote === quote);

  return (
    <div className="container">
      <h1 className="title">ᡣ𐭩.♡.❤️.Daily Motivation.♡.❤️.ᡣ𐭩</h1>

      <div className="quoteCard">
        {loading ? (
          <p>Fetching inspiration...</p>
        ) : (
          <>
            <p className="quote">
              {quote || "Click 'New Quote'"}
            </p>
            {author && (
              <p className="author">— {author}</p>
            )}
          </>
        )}

        <div className="buttons">
          <button onClick={fetchQuote} disabled={loading}>
            {loading ? "Loading..." : "New Quote"}
          </button>

          <button onClick={toggleLike}>
            {isLiked ? "💔 Unlike" : "❤️ Like"}
          </button>
        </div>
      </div>

      <div className="likedBox">
        <h3>❤️ Saved Quotes ({likedQuotes.length})</h3>
        <button
          onClick={() => {
            localStorage.removeItem("likedQuotes");
            setLikedQuotes([]);
          }}
        >
          Clear All
        </button>
        {likedQuotes.length === 0 ? (
          <p>No saved quotes yet</p>
        ) : (
          <ul>
            {likedQuotes.map((q, i) => (
              <li key={i}>
                "{q.quote}" — {q.author}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;