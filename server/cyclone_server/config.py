# coding: utf-8

import sys
import ConfigParser
import os
from cyclone.util import ObjectDict
import json

CONFIG_FILE_PATH = 'cyclone_server.conf'


def xget(func, section, option, default=None):
    try:
        return func(section, option)
    except:
        return default


def parse_config(filename=None):
    global CONFIG_FILE_PATH
    if CONFIG_FILE_PATH is None and os.path.isfile(filename):
        CONFIG_FILE_PATH = os.path.abspath(filename)
    cfg = ConfigParser.RawConfigParser()
    with open(filename) as fp:
        cfg.readfp(fp)

    settings = {}

    # web server settings
    settings["debug"] = xget(cfg.getboolean, "server", "debug", False)
    settings["base_url"] = cfg.get("server", "base_url")


    # get project's absolute path
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    print root
    getpath = lambda k, v: os.path.join(root, xget(cfg.get, k, v))

    # template and static directories' path
    settings["static_path"] = getpath("frontend", "static_path")
    settings["template_path"] = getpath("frontend", "template_path")

    return settings
