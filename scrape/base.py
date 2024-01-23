from playwright.sync_api import sync_playwright

def login(email, password):
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://intranet.alxswe.com/")

        # Fill in email and password fields
        page.fill("#user_email", email)
        page.fill("#user_password", password)

        # Click on the login button
        page.click("#user_remember_me")
        page.click("#actions > input[type=submit]")

        # Wait for the login process to complete
        page.wait_for_load_state("networkidle")

        # Perform any additional actions after login
        
        # Close the browser
        browser.close()

# Usage example
login("your_email@example.com", "your_password")
