#!/usr/bin/env python3
"""
Development server for ShapeMorpher
A simple HTTP server with some development conveniences
"""

import argparse
import http.server
import socketserver
import os
import sys
from datetime import datetime

class DevServerHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with CORS and development features"""

    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        """Enhanced logging with timestamps"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {format % args}")

def main():
    parser = argparse.ArgumentParser(description='ShapeMorpher Development Server')
    parser.add_argument('--port', '-p', type=int, default=8080, help='Server port (default: 8080)')
    parser.add_argument('--directory', '-d', default='.', help='Directory to serve (default: current)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()

    # Change to the specified directory
    if args.directory != '.':
        try:
            os.chdir(args.directory)
        except OSError:
            print(f"Error: Could not change to directory '{args.directory}'")
            sys.exit(1)

    # Verify index.html exists
    if not os.path.exists('index.html'):
        print("Warning: index.html not found in current directory")

    try:
        with socketserver.TCPServer(("", args.port), DevServerHandler) as httpd:
            print(f"🚀 ShapeMorpher Development Server")
            print(f"📂 Serving: {os.getcwd()}")
            print(f"🌐 URL: http://localhost:{args.port}")
            print(f"⏰ Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"🛑 Press Ctrl+C to stop")
            print("-" * 50)

            httpd.serve_forever()

    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except OSError as e:
        print(f"Error: Could not start server on port {args.port}")
        print(f"Details: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
