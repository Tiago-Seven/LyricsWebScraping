from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as soup
import re

#Page URL
pageUrl = "https://genius.com/Eminem-greatest-lyrics"

#headers so that genius doesn't return 403
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3'}
req = Request(url=pageUrl, headers=headers)
uClient = urlopen(req)

pageHtml = uClient.read()
uClient.close()
#parse HTML from genius page
page_soup = soup(pageHtml,"html.parser")
rawLyrics = page_soup.find("div",class_="lyrics").getText()

pretty = re.sub(r'\[Intro\]|\[Chorus\]|\[Verse \d\]', '', rawLyrics)
#removed everything except alphanumeric and spaces
pretty = re.sub(r'([^\s\w]|_)+', '', pretty)
pretty = re.sub('\n+', " ", pretty)
print(pretty.split(" "))
