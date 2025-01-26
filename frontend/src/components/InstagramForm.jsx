import React, { useState } from "react";
import styles from "./Form.module.css";

function InstagramForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    profile_url: "",
    post_count: "1",
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
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="profile_url">Profile URL</label>
        <input
          id="profile_url"
          name="profile_url"
          value={formData.profile_url}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="post_count">Post Count</label>
        <input
          id="post_count"
          name="post_count"
          type="number"
          value={formData.post_count}
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
        Scrape Instagram
      </button>
    </form>
  );
}

export default InstagramForm;
