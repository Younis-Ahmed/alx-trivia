from playwright.sync_api import Playwright


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://intranet.alxswe.com/auth/sign_in")
    page.get_by_label("Email").fill("jonasahmed19@hotmail.com")
    page.get_by_label("Password").click()
    page.get_by_label("Password").fill("jONASAHMED19")
    page.get_by_label("Remember me").check()
    page.get_by_role("button", name="Log in").click()
