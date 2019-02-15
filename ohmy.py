import SimpleHTTPServer
import re
import urllib2

class MyHTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")


    def do_GET(self):
        m = re.match(r'/v1/image\?image=(.*)', self.path)
        if m is not None:
            url = m.groups()[0]
            response = urllib2.urlopen(url)
            self.protocol_version = 'HTTP/1.1'
            self.send_response(200, 'OK')
            self.send_header('Content-type', 'image/jpeg')
            self.end_headers()
            self.wfile.write(bytes(response.read()))
            return

        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)


if __name__ == '__main__':
    print 'open http://0.0.0.0:8000 to view'
    SimpleHTTPServer.test(HandlerClass=MyHTTPRequestHandler)


