import React, { useState } from "react";
import styles from "./ResultDisplay.module.css";

function ResultDisplay({ result }) {
  const [expandedPost, setExpandedPost] = useState(null);

  if (result.video_title) {
    // YouTube result
    return (
      <div className={styles.resultContainer}>
        <h2 className={styles.title}>TITLE : {result.video_title}</h2>
        <p>
          <strong>Channel:</strong> {result.channel_name}
        </p>
        <p>
          <strong>Subscribers:</strong> {result.subscriber_count}
        </p>
        <h3>Comments:</h3>
        <ul className={styles.commentList}>
          {result.comments.map((comment, index) => (
            <li key={index} className={styles.comment}>
              {comment}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    // Instagram result
    return (
      <div className={styles.resultContainer}>
        <h2 className={styles.title}>Scraped Posts</h2>
        {result.map((post, index) => (
          <div key={post.post_url || index} className={styles.post}>
            <h3
              className={styles.postTitle}
              onClick={() =>
                setExpandedPost(expandedPost === index ? null : index)
              }
              aria-expanded={expandedPost === index}
            >
              Post {index + 1} (click to expand)
            </h3>
            {expandedPost === index && (
              <div className={styles.postContent}>
                <p>
                  <strong>URL:</strong> {post.post_url}
                </p>
                <h4>Comments:</h4>
                {Array.isArray(post.comments) && post.comments.length > 0 ? (
                  <ul className={styles.commentList}>
                    {post.comments.map((comment, commentIndex) => (
                      <li
                        key={comment.commenter_id || commentIndex}
                        className={styles.comment}
                      >
                        <strong>{comment.commenter_id}:</strong>{" "}
                        {comment.comment}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default ResultDisplay;
