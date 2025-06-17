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

  const handleSubmit = (e, action) => {
    e.preventDefault();
    if (action === "scrape") {
      onSubmit(formData);
    } else if (action === "download") {
      downloadVideo(formData.video_url);
    }
  };

  const downloadVideo = (videoUrl) => {
    if (!videoUrl) return alert("Please enter a YouTube URL");

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "http://localhost:3000/download";
    form.target = "_blank";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "url";
    input.value = videoUrl;

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <form className={styles.form}>
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
      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.submitButton}
          onClick={(e) => handleSubmit(e, "scrape")}
        >
          Scrape YouTube
        </button>
        <button
          type="button"
          className={styles.downloadButton}
          onClick={(e) => handleSubmit(e, "download")}
        >
          Download Video
        </button>
      </div>
    </form>
  );
}

export default YouTubeForm;
