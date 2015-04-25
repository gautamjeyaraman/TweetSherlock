import json
from cyclone_server import config
from twitter_client import TwitterClient
import cyclone

class APIBase(cyclone.web.RequestHandler):

    def get_config(self):
        path = config.config_file_path()
        settings = config.parse_config(path)
        return settings

    def prepare(self):
        self.set_header("Content-Type", "application/json")
        self.set_header("Cache-Control", "no-cache")

    def write_json(self, d):
        self.set_header("Content-Type", "application/json")
        return self.write(json.dumps(d, sort_keys=True, indent=4))


class TweetHandler(APIBase):

    def get(self):
        return self.write_json({'success': True})
