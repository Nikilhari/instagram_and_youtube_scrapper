import React, { useState } from "react";
import InstagramForm from "./InstagramForm";
import YouTubeForm from "./YouTubeForm";
import ResultDisplay from "./ResultDisplay";
import styles from "./ScrapperForm.module.css";

function ScraperForm() {
  const [activeTab, setActiveTab] = useState("instagram");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (url, data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setResult(result);
      console.log(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.scraperForm}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "instagram" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("instagram")}
        >
          Instagram
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "youtube" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("youtube")}
        >
          YouTube
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "instagram" && (
          <InstagramForm
            onSubmit={(data) =>
              handleSubmit("http://127.0.0.1:5000/scrape/instagram", data)
            }
          />
        )}
        {activeTab === "youtube" && (
          <YouTubeForm
            onSubmit={(data) =>
              handleSubmit("http://127.0.0.1:5000/scrape/youtube", data)
            }
          />
        )}
      </div>
      {isLoading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {result && <ResultDisplay result={result} />}
    </div>
  );
}

export default ScraperForm;
