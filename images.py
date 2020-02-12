import urllib.request
import os

for i in range(1, 310):
    filename = 'buffer/{}.png'.format(i)
    try:
        f = open(filename, 'wb')
        f.write(urllib.request.urlopen(f'http://endlessfrontierdata.com/images/artifacts/{i}').read())
        f.close()
    except:
        print('failed {}'.format(i))
        os.remove(filename)