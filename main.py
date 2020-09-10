import requests
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as soup
import re
from nltk.corpus import stopwords
import time

from flask import Flask, request as flaskRequest, jsonify

#remove proxies, genius doesn't like proxies
proxies = {
    "http": None,
    "https": None,
}

domain = "https://genius.com/"



def removeTags(text):
    '''Removes tags in the lyrics '''
    # assumption that square brackets never appear on the actual lyrics
    return re.sub(r'\[(.*?)\]', '', text)



def wordListToLowercase(wordList):
    wordList = [word.lower() for word in wordList]
    return wordList

def removeStopWords(wordList):
    '''Removes common stop words using nltk https://www.nltk.org/'''
    wordList = [
        word for word in wordList if word not in stopwords.words('english')]
    return wordList


def prettifyRawLyrics(rawLyrics):
    # remove tags that dont belong with the lyrics
    prettier = removeTags(rawLyrics)

    # removed everything except alphanumeric and spaces
    prettier = re.sub(r'([^\s\w]|_)+', '', prettier)

    # remove spaces and \n from the ends
    prettier = prettier.strip()

    # replace \n with " " to separate words
    prettier = re.sub('\n+', " ", prettier)

    return prettier


def getHTMLSoup(url):
    r = requests.get(url, proxies=proxies)

    # get soup HTML from genius page
    page_soup = soup(r.content, 'html.parser')
    return page_soup


def addDictionaries(dict1, dict2):
    for word in dict2:
        if word in dict1:
            dict1[word] += dict2[word]
        else:
            dict1[word] = dict2[word]
    return dict1


def getMusicLyricDictionary(url):
    page_soup = getHTMLSoup(url)
    rawLyrics = page_soup.find("div", class_="lyrics").getText()
    musicTitle = page_soup.find("h1").getText()

    # prettify raw lyrics
    prettier = prettifyRawLyrics(rawLyrics)

    # split lyrics to a word list
    wordList = prettier.split(' ')
    wordList = wordListToLowercase(wordList)
    filtered_words = removeStopWords(wordList)
 
    counts = dict()
    for i in filtered_words:
        counts[i] = counts.get(i, 0) + 1

    musicStats = dict()
    musicStats["numberOfWords"] = len(filtered_words)
    musicStats["numberOfUniqueWords"] = len(counts)
    musicStats["wordFrequency"] = counts
    musicStats["musicTitle"] = musicTitle

    return musicStats


def getAlbumLyricDictionary(url):
    page_soup = getHTMLSoup(url)
    row = page_soup.find_all("a", href=True)
    musicsURLs = []
    musicsNames = []
    #main dictionary
    albumStats = dict()

    #dictionary with the totals of the musics on the album
    albumTotals = dict()
    albumTotals["numberOfUniqueWords"] = 0
    albumTotals["numberOfWords"] = 0

    #dictionary with the frequency of all the words of all the musics in the album
    totalWordFrequency = dict()

    #dictionary with the stats and info of the musics in the album
    albumMusics = dict()
    albumMusics["error_musics"] = []
    for a in row:
        h3_inside_a = a.find("h3", class_="chart_row-content-title")
        if h3_inside_a:
            musicsNames.append(h3_inside_a.contents[0])
            musicsURLs.append(a["href"])

    for i, musicULR in enumerate(musicsURLs):
        waiting_time = 5 #seconds
        waiting_turns = 0
        done = False
        max_waiting_time = 320
        while not done and waiting_time <= max_waiting_time:
            try:
                print(musicULR)
                print("waiting {} seconds".format(waiting_time))
                time.sleep(waiting_time)
                print("doing")
                musicDict = getMusicLyricDictionary(musicULR)
                print("adding...")
                done = True
            except AttributeError:
                waiting_time = waiting_time * 2
        
        if waiting_time > max_waiting_time:
            albumMusics["error_musics"].append(musicsNames[i])
            continue

        albumMusics[musicDict["musicTitle"]] = musicDict
        
        albumTotals["numberOfUniqueWords"] += musicDict["numberOfUniqueWords"]
        albumTotals["numberOfWords"] += musicDict["numberOfWords"]
        totalWordFrequency = addDictionaries(totalWordFrequency, musicDict["wordFrequency"])
    
    albumTotals["wordFrequency"] = totalWordFrequency
    albumStats["totals"] = albumTotals
    albumStats["musics"] = albumMusics
    return albumStats


def makeMusicUrl(artistName, musicName):
    # replace spaces with "-"
    musicUrl = re.sub(" ", "-", musicName)
    artistName = re.sub(" ", "-", artistName)

    # add artist
    musicUrl = artistName+"-"+musicUrl

    # add lyrics to url
    musicUrl = musicUrl + "-lyrics"

    # add domain
    musicUrl = domain + musicUrl
    return musicUrl


def makeAlbumUrl(artistName, albumName):
    # replace spaces with "-"
    albumUrl = re.sub(" ", "-", albumName)

    # add artist
    albumUrl = artistName+"/"+albumUrl

    # add lyrics to url
    albumUrl = "albums/"+ albumUrl

    # add domain
    albumUrl = domain + albumUrl
    return albumUrl

app = Flask(__name__)

##### API available routes
#/album?artist=<artist>&album=<music>
@app.route('/album')
def albumStatsRoute():
    artistName = flaskRequest.args.get('artist', type=str)
    albumName = flaskRequest.args.get('album', type=str)
    albumUrl = makeAlbumUrl(artistName, albumName)
    lyricDictionary = getAlbumLyricDictionary(albumUrl)
    return jsonify(lyricDictionary)

#/music?artist=<artist>&music=<music>
@app.route('/music')
def musicStatsRoute():
    artistName = flaskRequest.args.get('artist', type = str)
    musicName = flaskRequest.args.get('music', type = str)
    musicUrl = makeMusicUrl(artistName, musicName)
    lyricDictionary = getMusicLyricDictionary(musicUrl)
    return jsonify(lyricDictionary)

# albumURL = "https://genius.com/albums/Eminem/Kamikaze"
# lyricDictionary = getAlbumLyricDictionary(albumURL)
# i = 0
# for w in sorted(lyricDictionary, key=lyricDictionary.get, reverse=True):
#     if(i < 50):
#         print(w, lyricDictionary[w])
#     i += 1

# pageUrl = "https://genius.com/Eminem-the-ringer-lyrics"
# lyricDictionary = getmusicLyricDictionary(pageUrl)


# TODO number of words/ number of unique words

# TODO try to add unit tests...
# addDictionaries
# prettifyRawLyrics
