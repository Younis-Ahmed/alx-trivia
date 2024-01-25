from typing import Any, List
from playwright.sync_api import Playwright, sync_playwright, BrowserContext, Browser, Page
from dotenv import load_dotenv
import os
from bs4 import BeautifulSoup, ResultSet
import json

load_dotenv()


def write_to_file(data) -> None:
    filepath = "questionsTest.json"
    if not data:
        print("No data to write.")
        return

    try:
        new_data: List[str] = json.loads(data)  # Validate JSON
    except json.JSONDecodeError:
        print("Data is not valid JSON.")
        return
    
    if not os.path.exists(filepath):
        with open(filepath, "w") as file:
            json.dump(new_data, file, indent=4)
        return


    try:
        with open(filepath, "r+") as file:
            old_data: List[str] = json.load(file) # Validate JSON
            old_data.extend(new_data) # Add new data to old data
            file.seek(0) # Move cursor to beginning of file
            json.dump(old_data, file, indent=4) # Write old data + new data to file
            file.truncate() # Remove old data from file
    except json.JSONDecodeError as e:
        print(f"Error in JSON file: {e}...")


def run(playwright: Playwright, url: str, lang_tag: str) -> None:
    questions: list = []
    data: dict = {}
    browser: Browser = playwright.chromium.launch(headless=True)
    context: BrowserContext = browser.new_context()
    page: Page = context.new_page()
    page.goto("https://intranet.alxswe.com/auth/sign_in")
    page.get_by_label("Email").fill(os.getenv("EMAIL"))
    page.get_by_label("Password").click()
    page.get_by_label("Password").fill(os.getenv("PASSWORD"))
    page.get_by_label("Remember me").check()
    page.get_by_role("button", name="Log in").click()
    page.goto(url)
    page.mouse.wheel(0, 1000)
    page.get_by_text("(Show quiz)").click()
    html: str = page.inner_html(".quiz_questions_show_container")
    soup = BeautifulSoup(html, "html.parser")
    rel: ResultSet[Any] = soup.find_all("div", class_="clearfix")
    for i in rel:
        data = {
            "question": ' '.join(p.text for p in i.select("div > p")) if len(i.select("div > p")) > 1 else i.find("p").text.strip(),
            "language": lang_tag,
            "answersArray": [],
            "correctAnswer": None,
            "code": i.find("pre").text if i.find("pre") else None,
        }
        for j in i.find_all("li"):
            data["answersArray"].append(j.text.strip())
            input_element: str | None = j.find("input")
            if input_element and "checked" in input_element.attrs:
                data["correctAnswer"] = j.text.strip()
        questions.append(data)
    write_to_file(json.dumps(questions))
    context.close()
    browser.close()


if __name__ == "__main__":
    with sync_playwright() as playwright:
        # run(playwright, "https://intranet.alxswe.com/projects/100021", "Vi")
        run(playwright, "https://intranet.alxswe.com/projects/1106", "Git")
        # run(playwright, "https://intranet.alxswe.com/projects/1103", "Shell")
        # run(playwright, "https://intranet.alxswe.com/projects/1100", "Shell")
        # run(playwright, "https://intranet.alxswe.com/projects/213", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/214", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/215", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/216", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/217", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/218", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/219", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/220", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/221", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/222", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/223", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/224", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/225", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/226", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/227", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/228", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/229", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/230", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/231", "Python")
        # run(playwright, "https://intranet.alxswe.com/projects/232", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/233", "Python")
        # run(playwright, "https://intranet.alxswe.com/projects/234", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/235", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/239", "Python")
        # run(playwright, "https://intranet.alxswe.com/projects/240", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/241", "Python")
        # run(playwright, "https://intranet.alxswe.com/projects/242", "C")
        # run(playwright, "https://intranet.alxswe.com/projects/243", "Python")
