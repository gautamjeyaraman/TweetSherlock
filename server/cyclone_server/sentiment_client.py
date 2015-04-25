from cyclone_server.services.textprocessor.sentimentClassifier import SentimentClassifier

class SentimentClient(object):
    def __init__(self):
        self._SentimentClassifierObj = SentimentClassifier()

    @property
    def SentimentClassifierObj(self):
        return self._SentimentClassifierObj

    def getSentiment(self, tweet):
        if self._SentimentClassifierObj:            
            res = self._SentimentClassifierObj.infer_sentiment(tweet)
            return res
        else:
            return None
