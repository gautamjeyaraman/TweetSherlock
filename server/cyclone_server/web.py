import cyclone.web
from cyclone_server import routes


class Application(cyclone.web.Application):
    def __init__(self, settings):
        handlers = routes.routes
        cyclone.web.Application.__init__(self, handlers, **settings)
