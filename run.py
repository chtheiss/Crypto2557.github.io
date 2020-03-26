from app import create_app
from livereload import Server

app, freezer, pages, _ = create_app()

app.debug = True

if __name__ == "__main__":
    flask_wsgi_app = app.wsgi_app
    server = Server(flask_wsgi_app)
    server.serve()
