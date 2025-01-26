import React, { useState } from "react";
import styles from "./Form.module.css";

function YouTubeForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    video_url: "",
    max_comments: "5",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="video_url">Video URL</label>
        <input
          id="video_url"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="max_comments">Max Comments</label>
        <input
          id="max_comments"
          name="max_comments"
          type="number"
          value={formData.max_comments}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Scrape YouTube
      </button>
    </form>
  );
}

export default YouTubeForm;
