from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as soup
import re
from nltk.corpus import stopwords

#removes tags in the lyrics 
def removeTags(text):
  #assumption that square brackets never appear on the actual lyrics
  return re.sub(r'\[(.*?)\]', '', rawLyrics)

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

  #replace \n with " " so separate words
  prettier = re.sub('\n+', " ", prettier)

  return prettier


#Page URL
pageUrl = "https://genius.com/Eminem-the-ringer-lyrics"

#headers so that genius doesn't return 403
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3'}
req = Request(url=pageUrl, headers=headers)
uClient = urlopen(req)

pageHtml = uClient.read()
uClient.close()
#parse HTML from genius page
page_soup = soup(pageHtml,"html.parser")
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

for w in sorted(counts, key=counts.get, reverse=True):
  print(w, counts[w])

