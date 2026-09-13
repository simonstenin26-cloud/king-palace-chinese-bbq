"""Start a loopback-only preview and open it in the default browser."""

import argparse
import errno
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import subprocess
import sys
import threading
import time
from urllib.request import urlopen


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check site files without starting a server')
    args = parser.parse_args()
    directory = Path(__file__).resolve().parent / 'site'
    required = ['index.html', 'styles.css', 'app.js', 'menu-data.js', 'menu-model.js']
    missing = [name for name in required if not (directory / name).is_file()]
    if missing:
        print('Missing website files: ' + ', '.join(missing), file=sys.stderr)
        return 1
    if args.check:
        print(f'Website files ready: {directory}')
        return 0

    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(directory))
    server = None
    for port in range(4173, 4184):
        try:
            server = ThreadingHTTPServer(('127.0.0.1', port), handler)
            break
        except OSError as error:
            if error.errno == errno.EADDRINUSE:
                continue
            print(f'Cannot start a local server: {error}', file=sys.stderr)
            print('Run Open King Palace.command from Finder on your Mac.', file=sys.stderr)
            return 1
    if server is None:
        print('Ports 4173–4183 are occupied. Close an unused preview server and try again.', file=sys.stderr)
        return 1

    url = f'http://localhost:{server.server_port}/'
    health_url = f'http://127.0.0.1:{server.server_port}/'
    # Serve first, then verify a real HTTP response before opening a browser.
    serving = threading.Thread(target=server.serve_forever, daemon=True)
    serving.start()
    healthy = False
    for _ in range(30):
        try:
            with urlopen(health_url, timeout=0.5) as response:
                healthy = response.status == 200 and response.read(64).startswith(b'<!doctype html')
                break
        except Exception:
            time.sleep(0.1)
    if not healthy:
        server.shutdown()
        server.server_close()
        print('The local server started but did not return index.html.', file=sys.stderr)
        return 1

    print(f'\nKing Palace BBQ is available at:\n\n  {url}\n', flush=True)
    print('Keep this Terminal window open. Press Control-C to stop.\n', flush=True)
    # Create a fresh Chrome window; fall back to the default browser when Chrome is unavailable.
    def open_browser():
        chrome = Path('/Applications/Google Chrome.app').exists()
        if chrome:
            script = f'''tell application "Google Chrome"
                activate
                set previewWindow to make new window
                set URL of active tab of previewWindow to "{url}"
            end tell'''
            result = subprocess.run(['osascript', '-e', script], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if result.returncode == 0:
                return
        subprocess.run(['open', url], check=False)
    threading.Thread(target=open_browser, daemon=True).start()
    try:
        serving.join()
    except KeyboardInterrupt:
        print('\nWebsite server stopped.')
        server.shutdown()
    finally:
        server.server_close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
