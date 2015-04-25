from twitter import *
import json


api_key = "nyTlPq9FAtSn40RgzS0GrJutR"
api_secret = "3jSIVMlmD7tbyf7mbUy1IM8uQoQtOWYkmSmhagv1LUNFalhlEj"
access_token = "210245671-Lubaxqeuqzkbl7MIpQd0oIxAjOI4BIdlu3ZN45j6"
access_secret = "k7dUaC1WDSJNLFe5rJ5DEXIuFUHh7eqBzHMQXDmsas3Aj"


class TwitterClient(object):
    def __init__(self):
        self.conn = Twitter(auth=OAuth(access_token, access_secret, api_key, api_secret))

    def getTweets(self, query):
        response = self.conn.search.tweets(q= query, count=100)
        return response
