"""Serve this cloned website locally and open it in your browser.
Usage:  python serve.py   (or double-click OPEN_SITE.bat on Windows)"""
import http.server, os, socket, threading, webbrowser

os.chdir(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    # Don't trust the OS MIME registry (Windows often maps .js to text/plain,
    # which makes browsers refuse module scripts).
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
                      ".svg": "image/svg+xml", ".json": "application/json", ".wasm": "application/wasm",
                      ".woff": "font/woff", ".woff2": "font/woff2", ".webp": "image/webp", ".avif": "image/avif"}

    def log_message(self, *args):
        pass


def free_port(start=8080):
    for port in range(start, start + 100):
        with socket.socket() as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
    return 0


port = free_port()
server = http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler)
url = f"http://localhost:{server.server_address[1]}/"
print(f"Serving the cloned site at {url}  (press Ctrl+C to stop)")
threading.Timer(0.8, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
