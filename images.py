import urllib.request

for i in range(1,222):
    try:
        f = open('{}.png'.format(i), 'wb')
        f.write(urllib.request.urlopen('https://www.endlessfrontierdata.com/images/units/{}'.format(i)).read())
        f.close()
    except:
        print('failed {}'.format(i))