# coding: utf-8

import cyclone_server.config
import cyclone_server.web

from twisted.python import usage
from twisted.plugin import IPlugin
from twisted.application import service, internet
from zope.interface import implements


class Options(usage.Options):
    optParameters = [
        ["port", "p", 8888, "TCP port to listen on for HTTP", int],
        ["ftp-port", "f", 9999, "TCP port to listen on for FTP", int],
        ["listen", "l", "127.0.0.1", "Network interface to listen on"],
        ["config", "c", "cyclone_server.conf",
            "Configuration file with server settings"],
    ]


class ServiceMaker(object):
    implements(service.IServiceMaker, IPlugin)
    tapname = "cyclone_server"
    description = "cyclone-based web server"
    options = Options

    def __parse_config(self, options):
        return cyclone_server.config.parse_config(options["config"])

    def makeWebService(self, options, settings):
        port = options["port"]
        interface = options["listen"]
        return internet.TCPServer(port,
                cyclone_server.web.Application(settings),
                                  interface=interface)

    def makeFtpService(self, options, settings):
        port = options["ftp-port"]
        interface = options["listen"]
        ftp_enabled = settings.get("ftp_enabled")
        if ftp_enabled:
            import cyclone_server.ftp
            return internet.TCPServer(port,
                    cyclone_server.ftp.factory,
                    interface=interface)

    def makeService(self, options):
        svc = service.MultiService()
        settings = cyclone_server.config.parse_config(options["config"])
        webService = self.makeWebService(options, settings)

        if webService:
            svc.addService(webService)
        
        return svc

serviceMaker = ServiceMaker()
