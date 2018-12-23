from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as soup
import re
from nltk.corpus import stopwords

#headers so that genius doesn't return 403
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3'}

#removes tags in the lyrics 
def removeTags(text):
  #assumption that square brackets never appear on the actual lyrics
  return re.sub(r'\[(.*?)\]', '', text)

def wordListToLowercase(wordList):
  wordList = [word.lower() for word in wordList]
  return wordList

#removes common stop words using nltk https://www.nltk.org/
def removeStopWords(wordList):
  wordList = [word for word in wordList if word not in stopwords.words('english')]
  return wordList

def prettifyRawLyrics(rawLyrics):
  #remove tags that dont belong with the lyrics
  prettier = removeTags(rawLyrics)

  #removed everything except alphanumeric and spaces
  prettier = re.sub(r'([^\s\w]|_)+', '', prettier)

  #remove spaces and \n from the ends
  prettier = prettier.strip()

  #replace \n with " " to separate words
  prettier = re.sub('\n+', " ", prettier)

  return prettier

def getHTMLSoup(url):
  req = Request(url=url, headers=headers)
  uClient = urlopen(req)

  #get HTML
  pageHtml = uClient.read()
  #close connection
  uClient.close()

  #get soup HTML from genius page
  page_soup = soup(pageHtml, "html.parser")

  return page_soup

def getSongLyricDictionary(url):
  page_soup = getHTMLSoup(url)
  rawLyrics = page_soup.find("div",class_="lyrics").getText()

  #prettify raw lyrics
  prettier = prettifyRawLyrics(rawLyrics)

  #split lyrics to a word list
  wordList = prettier.split(' ')


  wordList = wordListToLowercase(wordList)

  filtered_words = removeStopWords(wordList)

  counts = dict()
  for i in filtered_words:
    counts[i] = counts.get(i, 0) + 1

  return counts
  
def getAlbumLyricDictionary(url):
  page_soup = getHTMLSoup(url)
  row = page_soup.find_all("a", href=True)
  songsURLs = []
  for a in row:
    if a.find("h3", class_="chart_row-content-title"):
      songsURLs.append(a["href"])
  print(songsURLs)


albumURL = "https://genius.com/albums/Eminem/Kamikaze"
getAlbumLyricDictionary(albumURL)

# pageUrl = "https://genius.com/Eminem-the-ringer-lyrics"

# lyricDictionary = getSongLyricDictionary(pageUrl)

# for w in sorted(lyricDictionary, key=lyricDictionary.get, reverse=True):
#     print(w, lyricDictionary[w])
