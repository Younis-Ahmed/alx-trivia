from playwright.sync_api import Playwright
from dotenv import load_dotenv
import os

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
