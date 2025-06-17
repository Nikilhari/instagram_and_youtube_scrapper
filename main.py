import time
import random
from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from flask_cors import CORS
# Flask setup
app = Flask(__name__)
CORS(app)
# Random delays

def short_random_delay():
    time.sleep(random.randint(2, 5))


def medium_random_delay():
    time.sleep(random.randint(6, 15))

def large_random_delay():
    time.sleep(random.randint(15, 25))

# Selenium WebDriver setup
driver_path = '../../BEA/Testing/drivers/chromedriver-win64/chromedriver.exe'
service = Service(driver_path)

# Instagram Scraping Functions
def login_user(driver, username, password):
    try:
        driver.find_element(By.NAME, 'username').send_keys(username)
        short_random_delay()
        driver.find_element(By.NAME, 'password').send_keys(password)
        short_random_delay()
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        medium_random_delay()

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Not Now')]"))
            ).click()
        except Exception:
            pass

        print("Login successful!")
    except Exception as e:
        print(f"Login failed: {e}")

def scrape_comments_from_post(driver, post_url, max_comments):
    driver.get(post_url)
    short_random_delay()
    comments_data = []

    while len(comments_data) < max_comments:
        try:
            commenter_elements = driver.find_elements(By.CSS_SELECTOR, "h3 a")
            comment_elements = driver.find_elements(By.CSS_SELECTOR, "div.xt0psk2 span")

            for commenter, comment in zip(commenter_elements, comment_elements):
                commenter_id = commenter.text.strip()
                comment_text = comment.text.strip()

                comments_data.append({
                    "commenter_id": commenter_id,
                    "comment": comment_text
                })
                if len(comments_data) >= max_comments:
                    break

            if len(comments_data) >= max_comments:
                break

        except Exception as e:
            print(f"Error while scraping comments: {e}")
            break

    return comments_data

def goto_profile_and_scrape(driver, profile_url, post_count, max_comments):
    driver.get(profile_url)
    short_random_delay()
    collected_links = []

    containers = driver.find_elements(By.XPATH, "//div[@style='display: flex; flex-direction: column; padding-bottom: 0px; padding-top: 0px; position: relative;']")
    for container in containers:
        child_divs = container.find_elements(By.CSS_SELECTOR, 'div._ac7v.x1f01sob.xcghwft.xat24cr.xzboxd6')

        for child_div in child_divs:
            links = child_div.find_elements(By.TAG_NAME, 'a')

            for link in links:
                post_url = link.get_attribute('href')
                if post_url:
                    collected_links.append(post_url)
                if len(collected_links) >= post_count:
                    break
            if len(collected_links) >= post_count:
                break

    results = []
    for post_url in collected_links:
        print(f"Scraping comments from post: {post_url}")
        comments = scrape_comments_from_post(driver, post_url, max_comments)
        results.append({"post_url": post_url, "comments": comments})

    return results

# YouTube Scraping Function
def scrape_youtube_data(video_url, max_comments):
    driver = webdriver.Chrome(service=service)
    driver.get(video_url)
    time.sleep(5)

    video_title = driver.find_element(By.CSS_SELECTOR, "h1.style-scope.ytd-watch-metadata yt-formatted-string").text
    channel_name = driver.find_element(By.CSS_SELECTOR, '#channel-name #text').text
    try:
        subscriber_count = driver.find_element(By.CSS_SELECTOR, '#owner-sub-count').text
    except Exception:
        subscriber_count = "Subscriber count not available"

    comments = []
    scroll_pause = 5
    last_height = driver.execute_script("return document.documentElement.scrollHeight")

    while len(comments) < max_comments:
        driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
        time.sleep(scroll_pause)

        comment_elements = driver.find_elements(By.XPATH, '//*[@id="content-text"]')
        for comment in comment_elements:
            if len(comments) >= max_comments:
                break
            text = comment.text
            if text not in comments:
                comments.append(text)

        new_height = driver.execute_script("return document.documentElement.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    driver.quit()

    return {
        "video_title": video_title,
        "channel_name": channel_name,
        "subscriber_count": subscriber_count,
        "comments": comments
    }

# Flask Routes
@app.route('/scrape/instagram', methods=['POST'])
def scrape_instagram():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    profile_url = data.get("profile_url")
    post_count = int(data.get("post_count", 1))
    max_comments = int(data.get("max_comments", 5))

    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get('https://www.instagram.com')
        short_random_delay()

        login_user(driver, username, password)
        result = goto_profile_and_scrape(driver, profile_url, post_count, max_comments)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        driver.quit()

@app.route('/scrape/youtube', methods=['POST'])
def scrape_youtube():
    data = request.json
    video_url = data.get("video_url")
    max_comments = int(data.get("max_comments", 50))

    try:
        result = scrape_youtube_data(video_url, max_comments)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
