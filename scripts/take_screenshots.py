#!/usr/bin/env python3
"""Take full-page screenshots of huaxia-history app pages."""

from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = "/Users/twzhan/Documents/dev/huaxia-history/images/screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# (url, filename, is_mobile)
PAGES = [
    ("http://localhost:3456/event/event-unify", "event-detail.png", False),
    ("http://localhost:3456/figure/libai", "figure-timeline.png", False),
    ("http://localhost:3456/figure/zhugeliang", "figure-relation-graph.png", False),
    ("http://localhost:3456/dynasty/tang", "dynasty-page.png", False),
    ("http://localhost:3456/search?q=李白", "search-results.png", False),
    ("http://localhost:3456/404test", "custom-404.png", False),
    ("http://localhost:3456/map", "map-page.png", True),
    ("http://localhost:3456/timeline", "timeline-page.png", True),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for url, filename, is_mobile in PAGES:
        print(f"Capturing: {url} -> {filename}")

        context_options = {}
        if is_mobile:
            context_options["viewport"] = {"width": 375, "height": 812}
            context_options["device_scale_factor"] = 2
            context_options["is_mobile"] = True
            context_options["has_touch"] = True
            context_options["user_agent"] = (
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
            )
        else:
            context_options["viewport"] = {"width": 1440, "height": 900}
            context_options["device_scale_factor"] = 1

        context = browser.new_context(
            **context_options,
            color_scheme="dark",
        )

        page = context.new_page()
        page.goto(url, wait_until="networkidle")
        page.wait_for_timeout(2000)  # Wait 2s for animations/images to settle

        filepath = os.path.join(OUTPUT_DIR, filename)
        page.screenshot(path=filepath, full_page=True)
        print(f"  Saved: {filepath}")

        context.close()

    browser.close()
    print("Done!")
