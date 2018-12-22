from urllib.request import urlopen, Request
from bs4 import BeautifulSoup as soup

#Page URL
theRingerUrl = "https://genius.com/Eminem-the-ringer-lyrics"

#headers so that genius doesn't return 403
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3'}
req = Request(url=theRingerUrl, headers=headers)
uClient = urlopen(req)

pageHtml = uClient.read()
uClient.close()
#parse HTML from genius page
page_soup = soup(pageHtml,"html.parser")
print(page_soup.h1)
