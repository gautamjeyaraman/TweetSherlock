import nltk
import os
import cPickle
import nltk.classify.util
from nltk.classify import NaiveBayesClassifier, MaxentClassifier
from nltk.tokenize import RegexpTokenizer
import logging
import nltk.data
from nltk.corpus.reader import CategorizedPlaintextCorpusReader
from nltk.corpus import movie_reviews
import argparse
from nltk.corpus import stopwords
from replacers import RepeatReplacer, AntonymReplacer

ant_replacer = AntonymReplacer()
rep_replacer = RepeatReplacer()
english_stops = set(stopwords.words('english'))

curdir = os.path.abspath(os.curdir)
classifier_path = os.path.dirname(os.path.abspath(__file__)) + "/classifiers/nb_new_senti"

logger = logging.getLogger("textprocessor.sentimentClassifier") 
tokenizer = RegexpTokenizer("[\w']+")

def refine_words(words):
    #words = [word for word in words if word not in english_stops]
    words = [rep_replacer.replace(word) for word in words]
    return ant_replacer.replace_negations(words)


def word_feats(words):
    words = refine_words(words)
    return dict([(word, True) for word in words])
 
class SentimentClassifier():
    def __init__(self):
        try:
            classifier = None
            if not os.path.exists(classifier_path):

                '''with open('nltk_sentiment_data/polarity_pos.txt', 'rb') as fp:
                    pos_lines = fp.readlines()
                    pos_feats = [(word_feats(tokenizer.tokenize(p_line)), '1') for p_line in pos_lines]
                with open ('nltk_sentiment_data/polarity_neg.txt', 'rb') as fn:
                    neg_lines = fn.readlines()
                    neg_feats = [(word_feats(tokenizer.tokenize(n_line)), '0') for n_line in neg_lines]'''

                filename = os.path.dirname(os.path.abspath(__file__)) + "/nltk_sentiment_data/sentiment_data_twitter.txt"
                with open(filename, 'rb') as fp:                 
                    lines = fp.readlines()
                    feats =[(word_feats(tokenizer.tokenize(line.split(' -> ')[1].strip().lower())), line.split(' -> ')[0]) for line in lines if len(line.split(' -> ')) >=2]
                print "Total : %s" %(len(feats),)
                cutoff = int(len(feats)*0.1)
                trainfeats, testfeats = feats[cutoff:], feats[:cutoff]

                '''cutoff = int(len(pos_feats) * 0.1)
                trainfeats = pos_feats[cutoff:] + neg_feats[cutoff:]
                testfeats = pos_feats[:cutoff] + neg_feats[:cutoff]'''
                print 'train on %d instances, test on %d instances' % (len(trainfeats), len(testfeats))
 
                #classifier = NaiveBayesClassifier.train(trainfeats)
                classifier = MaxentClassifier.train(trainfeats, algorithm='iis', trace=0, max_iter=10)
                print 'accuracy:', nltk.classify.util.accuracy(classifier, testfeats)
                classifier.show_most_informative_features()
                with open(classifier_path, "w") as fh:
                    cPickle.dump(classifier, fh, 1)
            else:
                with open(classifier_path, "r") as fh:
                    classifier = cPickle.load(fh)
            self.classifier = classifier
            logger.info("Initialized SentimentClassifier instance..")
        except Exception, e:
            logger.exception(e)
            raise e
    
    def infer_sentiment(self, text):
        try:
            machine_guess = self.classifier.prob_classify(word_feats(tokenizer.tokenize(text.lower())))
            logger.info("Sentence:%s ## Sentiment Guess: positive = %s and negative = %s" % (text, machine_guess.prob('1'), machine_guess.prob('0')))
            return int(machine_guess.prob('1') * 100)
        except Exception, e:
            logger.exception(e)
            raise e 
