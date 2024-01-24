from playwright.sync_api import Playwright, sync_playwright, expect
from dotenv import load_dotenv
import os
from bs4 import BeautifulSoup


load_dotenv()


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://intranet.alxswe.com/auth/sign_in")
    page.get_by_label("Email").fill(os.getenv("EMAIL"))
    page.get_by_label("Password").click()
    page.get_by_label("Password").fill(os.getenv("PASSWORD"))
    page.get_by_label("Remember me").check()
    page.get_by_role("button", name="Log in").click()
    page.goto("https://intranet.alxswe.com/projects/100021")
    page.mouse.wheel(0, 1000)
    page.get_by_text("(Show quiz)").click()
    html = page.inner_html(".quiz_questions_show_container")
    # print(html)
    soup = BeautifulSoup(html, "html.parser")
    rel = soup.find_all("div", class_="clearfix")
    for i in rel:
        print(i.find("p").text)
        for j in i.find_all("li"):
            print(j.text)
        print("-----")

    context.close()
    browser.close()


if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
