from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "files"
NODE_RUNTIME = (
    Path.home()
    / ".cache"
    / "codex-runtimes"
    / "codex-primary-runtime"
    / "dependencies"
    / "node"
)
PLAYWRIGHT_DIR = NODE_RUNTIME / "node_modules" / "playwright"
CHROME_PATHS = [
    Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
    Path("/Applications/Chromium.app/Contents/MacOS/Chromium"),
    Path("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"),
]

PDFS = [
    ("resume-pdf.html", OUT_DIR / "xiajunhui-ios-resume.pdf"),
    ("resume-pdf-en.html", OUT_DIR / "junhui-xia-ios-resume-en.pdf"),
]

PRINT_SCRIPT = r"""
const { chromium } = require(process.env.RESUME_PLAYWRIGHT);
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.RESUME_CHROME || undefined,
  });
  const page = await browser.newPage({
    viewport: { width: 1240, height: 1754 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(process.env.RESUME_HTML).href, {
    waitUntil: 'networkidle',
  });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: process.env.RESUME_OUTPUT,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"""


def find_node() -> str:
    bundled = NODE_RUNTIME / "bin" / "node"
    if bundled.exists():
        return str(bundled)

    node = shutil.which("node")
    if node:
        return node

    raise RuntimeError("Node.js is required to generate resume PDFs.")


def find_playwright() -> str:
    if PLAYWRIGHT_DIR.exists():
        return str(PLAYWRIGHT_DIR)
    raise RuntimeError(f"Playwright was not found at {PLAYWRIGHT_DIR}.")


def find_chrome() -> str:
    for chrome_path in CHROME_PATHS:
        if chrome_path.exists():
            return str(chrome_path)
    return ""


def generate_pdf(node: str, playwright_dir: str, chrome_path: str, html: Path, output: Path) -> None:
    env = os.environ.copy()
    env.update(
        {
            "RESUME_PLAYWRIGHT": playwright_dir,
            "RESUME_CHROME": chrome_path,
            "RESUME_HTML": str(html),
            "RESUME_OUTPUT": str(output),
        }
    )
    subprocess.run([node, "-e", PRINT_SCRIPT], cwd=ROOT, env=env, check=True)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    node = find_node()
    playwright_dir = find_playwright()
    chrome_path = find_chrome()

    for html_name, output in PDFS:
        generate_pdf(node, playwright_dir, chrome_path, ROOT / html_name, output)
        print(f"Generated {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
