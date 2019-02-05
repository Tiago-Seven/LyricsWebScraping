from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as soup
import re
from nltk.corpus import stopwords

from flask import Flask, request as flaskRequest, jsonify

domain = "https://genius.com/"
# headers so that genius doesn't return 403
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3'}

# removes tags in the lyrics


def removeTags(text):
    # assumption that square brackets never appear on the actual lyrics
    return re.sub(r'\[(.*?)\]', '', text)


def wordListToLowercase(wordList):
    wordList = [word.lower() for word in wordList]
    return wordList

# removes common stop words using nltk https://www.nltk.org/


def removeStopWords(wordList):
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
    req = Request(url=url, headers=headers)
    uClient = urlopen(req)

    # get HTML
    pageHtml = uClient.read()
    # close connection
    uClient.close()

    # get soup HTML from genius page
    page_soup = soup(pageHtml, "html.parser")

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

    counts = dict()
    for a in row:
        if a.find("h3", class_="chart_row-content-title"):
            musicsURLs.append(a["href"])
    for musicULR in musicsURLs:
        print(musicULR)
        musicDict = getMusicLyricDictionary(musicULR)
        print("adding...")
        counts = addDictionaries(counts, musicDict)
    return counts


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
