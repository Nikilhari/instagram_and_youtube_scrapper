import React, { useState } from "react";
import ScraperForm from "./components/ScrapperForm";
import "./App.css";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const appClass = isDarkTheme ? "app dark" : "app light";
  const toggleClass = isDarkTheme ? "theme-toggle dark" : "theme-toggle light";

  return (
    <div className={appClass}>
      <div className="wrapper">
        <header className="header">
          <h1 className="title">Social Media Scraper</h1>
        </header>
        <button
          className={toggleClass}
          onClick={toggleTheme}
          aria-label={
            isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
          }
        >
          {isDarkTheme ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>
      <main className="main">
        <ScraperForm />
      </main>
    </div>
  );
}

export default App;
