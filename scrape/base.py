from playwright.sync_api import Playwright, sync_playwright
from dotenv import load_dotenv
import os
from bs4 import BeautifulSoup
import json

load_dotenv()


def write_to_file(data: str) -> None:
    if not data:
        print("No data to write.")
        return

    try:
        new_data = json.loads(data)  # Validate JSON
    except json.JSONDecodeError:
        print("Data is not valid JSON.")
        return

    try:
        with open("../questions.json", "r+") as f:
            file_data = json.load(f)  # Load existing data
            if new_data in file_data:
                print("Data already exists in file.")
                return
            file_data.extend(new_data)  # Append new data
            f.seek(0)  # Move file pointer to the beginning
            f.truncate()  # Clear the file
            # Write the updated data back to the file
            json.dump(file_data, f, indent=4)
    except json.JSONDecodeError as e:
        print(f"Error in JSON file: {e.doc[e.pos:e.pos+10]}...")


def run(playwright: Playwright, url: str, lang_tag: str) -> None:
    questions = []
    data = {}
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
    for i in rel:
        data = {
            "question": i.find("p").text,
            "language": lang_tag,
            "answers": [],
            "correct": None
        }
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
        # run(playwright, "https://intranet.alxswe.com/projects/100021", "Vi")
        # run(playwright, "https://intranet.alxswe.com/projects/1106", "Git")
        # run(playwright, "https://intranet.alxswe.com/projects/1103", "Shell")
        # run(playwright, "https://intranet.alxswe.com/projects/1100", "Shell")
        run(playwright, "https://intranet.alxswe.com/projects/213", "C")
        run(playwright, "https://intranet.alxswe.com/projects/214", "C")
        run(playwright, "https://intranet.alxswe.com/projects/215", "C")
        run(playwright, "https://intranet.alxswe.com/projects/216", "C")
        run(playwright, "https://intranet.alxswe.com/projects/217", "C")
        run(playwright, "https://intranet.alxswe.com/projects/218", "C")
        run(playwright, "https://intranet.alxswe.com/projects/219", "C")
        run(playwright, "https://intranet.alxswe.com/projects/220", "C")
        run(playwright, "https://intranet.alxswe.com/projects/221", "C")
        run(playwright, "https://intranet.alxswe.com/projects/222", "C")
        run(playwright, "https://intranet.alxswe.com/projects/223", "C")
        run(playwright, "https://intranet.alxswe.com/projects/224", "C")
        run(playwright, "https://intranet.alxswe.com/projects/225", "C")
        run(playwright, "https://intranet.alxswe.com/projects/226", "C")
        run(playwright, "https://intranet.alxswe.com/projects/227", "C")
        run(playwright, "https://intranet.alxswe.com/projects/228", "C")
        run(playwright, "https://intranet.alxswe.com/projects/229", "C")
        run(playwright, "https://intranet.alxswe.com/projects/230", "C")
        run(playwright, "https://intranet.alxswe.com/projects/231", "Python")
        run(playwright, "https://intranet.alxswe.com/projects/232", "C")
        run(playwright, "https://intranet.alxswe.com/projects/233", "Python")
        run(playwright, "https://intranet.alxswe.com/projects/234", "C")
        run(playwright, "https://intranet.alxswe.com/projects/235", "C")
        run(playwright, "https://intranet.alxswe.com/projects/239", "Python")
        run(playwright, "https://intranet.alxswe.com/projects/240", "C")
        run(playwright, "https://intranet.alxswe.com/projects/241", "Python")
        run(playwright, "https://intranet.alxswe.com/projects/242", "C")
        run(playwright, "https://intranet.alxswe.com/projects/243", "Python")
