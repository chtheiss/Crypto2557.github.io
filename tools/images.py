import urllib.request
import os

for i in range(264, 400):
    filename = 'buffer/{}.png'.format(i)
    try:
        f = open(filename, 'wb')
        f.write(urllib.request.urlopen('https://www.endlessfrontierdata.com/images/pets/{}a'.format(i)).read())
        f.close()
    except:
        print('failed {}'.format(i))
        os.remove(filename)