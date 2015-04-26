import json
from cyclone_server import config
from twitter_client import TwitterClient
#from sentiment_client import SentimentClient
import cyclone


#sentiment_classifier = SentimentClient()

stopWords = ['role_player', 'false', 'hearsay', 'imposter', 'faker', 'treasonably', 'cook', 'pseud', 'phoney', 'imitation', 'fake', 'faux', 'misrepresent', 'manipulate', 'counterfeit', 'bastard', 'shammer', 'traitorously', 'assumed', 'wangle', 'delusive', 'fictitious', 'bogus', 'forge', 'treacherously', 'fudge', 'falsify', 'juke', 'untrue', 'fictive', 'bruit', 'phony', 'pretended', "talk_through_one's_hat", 'mistaken', 'bull', 'pretender', 'off-key', 'bullshit', 'rumor', 'rumour', 'fraud', 'put_on', 'impostor', 'pseudo', 'sour', 'simulated', 'faithlessly', 'sham', 'postiche']

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


def fakeAnalyser(tweet):
    val = None
    tweet = tweet.split(' ')
    for stopWord in stopWords:
        if stopWord in tweet:
            if text[text.index(stopWord)-1] == 'not':
                val = 1
            else:
                val = 2
    if not val:
        val = 3
    return val


class TweetHandler(APIBase):

    def get(self):
        '''twitter_client = TwitterClient()
        query = self.get_argument("q")
        print "Fetching tweets"
        data = twitter_client.getTweets(query)

        print "Processing for sentiment"
        tweets = data['statuses']
        response = []
        for tweet in tweets:
            if 'retweeted_status' in tweet.keys() and type(tweet['retweeted_status']) == type({}):
                tweets.append(tweet['retweeted_status'])
            row = { 'created_at': tweet['created_at'],
                    'count': { 'favorite': tweet['favorite_count'],
                               'retweet': tweet['retweet_count'],
                               'views': tweet['user'].get('followers_count', 0)
                    },
                    'text': tweet['text'],
                    'hashtags': [x['text'] for x in tweet['entities']['hashtags']],
                    'user': { 'description': tweet['user'].get('description', None),
                              'favorite': tweet['user'].get('favorites_count', 0),
                              'followers': tweet['user'].get('followers_count', 0),
                              'location': tweet['user'].get('location', None),
                              'name': tweet['user'].get('name', None),
                              'image': tweet['user'].get('profile_image_url', None),
                              'tweets': tweet['user'].get('statuses_count', None),
                              'verified': tweet['user'].get('verified', None)
                    },
                    'sentiment': sentiment_classifier.getSentiment(tweet['text']),
                    'fake': fakeAnalyser(tweet['text'])
            }
            response.append(row)'''
        response = json.loads(open("result.json", "r").read())
        
        return self.write_json({'success': True, 'data': response})

