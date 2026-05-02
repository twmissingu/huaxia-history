import asyncio
from playwright.async_api import async_playwright

urls = [
    ("http://localhost:3456/figure/libai", "/Users/twzhan/Documents/dev/huaxia-history/images/screenshots/v2/figure-libai.png"),
    ("http://localhost:3456/dynasty/tang", "/Users/twzhan/Documents/dev/huaxia-history/images/screenshots/v2/dynasty-tang.png"),
    ("http://localhost:3456/timeline", "/Users/twzhan/Documents/dev/huaxia-history/images/screenshots/v2/timeline.png"),
    ("http://localhost:3456/event/event-qin-unification", "/Users/twzhan/Documents/dev/huaxia-history/images/screenshots/v2/event-qin-unification.png"),
    ("http://localhost:3456/404test", "/Users/twzhan/Documents/dev/huaxia-history/images/screenshots/v2/404test.png"),
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()
        
        for url, path in urls:
            print(f"Navigating to {url} ...")
            await page.goto(url, wait_until="networkidle")
            await asyncio.sleep(3)
            await page.screenshot(path=path, full_page=True)
            print(f"Saved screenshot to {path}")
        
        await browser.close()

asyncio.run(main())
