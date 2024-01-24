from playwright.sync_api import Playwright, sync_playwright, expect
from dotenv import load_dotenv
import os
from bs4 import BeautifulSoup
import json

load_dotenv()


def write_to_file(data: str) -> None:
    with open("../questions.json", "w") as f:
        f.append(data)


def run(playwright: Playwright, url: str, lang_tag: str) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://intranet.alxswe.com/auth/sign_in")
    page.get_by_label("Email").fill(os.getenv("EMAIL"))
    page.get_by_label("Password").click()
    page.get_by_label("Password").fill(os.getenv("PASSWORD"))
    page.get_by_label("Remember me").check()
    page.get_by_role("button", name="Log in").click()
    page.goto(url)
    page.mouse.wheel(0, 1000)
    page.get_by_text("(Show quiz)").click()
    html = page.inner_html(".quiz_questions_show_container")
    soup = BeautifulSoup(html, "html.parser")
    rel = soup.find_all("div", class_="clearfix")
    questions = []
    data = {}
    for i in rel:
        data = {"question": i.find("p").text, "answers": [
        ], "language": lang_tag, "correct": None}
        for j in i.find_all("li"):
            data["answers"].append(j.text.strip())
            input_element = j.find("input")
            if input_element and "checked" in input_element.attrs:
                data["correct"] = j.text.strip()
        questions.append(data)
    write_to_file(json.dumps(questions))
    context.close()
    browser.close()


if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright, "https://intranet.alxswe.com/projects/100021", "Vi")
