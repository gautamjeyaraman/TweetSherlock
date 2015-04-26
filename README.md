# TweetSherlock

###Problem statement that we chose
Discover the truth of a tweet. Help a user to figure out if a given information is true or not with tweets

###Our solution
Our solution was to generate a evidence dashboard for the given search text. The engine searched tweets for the given terms and generates a bunch of visualisations that give insights on the truth of the ground statement. We do this by using a combination of the features given by twitter as well as custom extracted features

###Technology stack
We used python's cyclone as the webserver, a sentiment classifier built on twitter data, D3.js for the frontend visualisations and bootstrap for the frontend's design

###Explanation
So the workflow is that once the user enters the text, we send to our server. The server loads the relevant tweets using the twitter api and processes it. Processing includes sentiment classification and a set of preprocessing operations. Then, we generate the dashboard by visualising the data in a bunch of different ways. We use D3.js for the visualisations.

###Future enhancements
There are so many different enhancements that can be done. Some are:
- Use topic classification of tweets and use it to relate with the tweeter's profile
- Load and process the tweets in real time continuously
- Use location as a search and filter parameter while searching, processing and visualising
- User real time filtering on the data based on various parameters

###Instructions to run the code
Download the code. Install all the requirements and then, move to server folder and run tools/run.py
This script starts the server. Go to http://localhost:8888 to see the webapp

###Screenshots of the app
![alt text](https://github.com/gautamjeyaraman/TweetSherlock/raw/master/screenshots/1.png "Home Page")
![alt text](https://github.com/gautamjeyaraman/TweetSherlock/raw/master/screenshots/2.png "Visualisations")
![alt text](https://github.com/gautamjeyaraman/TweetSherlock/raw/master/screenshots/3.png "Visualisations")
![alt text](https://github.com/gautamjeyaraman/TweetSherlock/raw/master/screenshots/4.png "Visualisations")
![alt text](https://github.com/gautamjeyaraman/TweetSherlock/raw/master/screenshots/5.png "Visualisations")
