

class TwitterClient(object):
    def __init__(self, query):
        self._query = query

    @property
    def query(self):
        return self._query

    def getTweets(self):
        return
