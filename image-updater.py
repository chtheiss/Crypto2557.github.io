import urllib.request
import argparse

def download_images(imagetype: str, startnumber: int, endnumber: int):
	""" Downloads select images from the Endless Frontier Data site.

	Args:
		imagetype (str): Type of image to download. One of: artifacts, pets, units.
		startnumber (int): Number of the first image to download.
		endnumber (int): Number of the last image to download.
	"""
	# Note that range is not inclusive, so the maximum number should be one more than you want.
	for i in range(startnumber, endnumber + 1):
		try:
			f = open('{}.png'.format(i), 'wb')
			f.write(urllib.request.urlopen('https://www.endlessfrontierdata.com/images/' + imagetype + '/{}'.format(i)).read())
			f.close()
		except:
			print('failed {}'.format(i))
	return

parser = argparse.ArgumentParser()
parser.add_argument("-a", "--artifacts", help="Will update artifact images", action="store_true")
parser.add_argument("-p", "--pets", help="Will update pet images.", action="store_true")
parser.add_argument("-u", "--units", help="Will update unit images.", action="store_true")
parser.add_argument("-s", "--start", help="Set the start number. Defaults to 1.", type=int, default=1)
parser.add_argument("-e", "--end", help="Set the end number.", type=int)

args = parser.parse_args()

# Determine what they want to generate. They must specify something.
if args.artifacts is False and args.pets is False and args.units is False:
	print("You must specify whether you want to pull artifact, pet, or unit images.\n")
	parser.print_help()
	exit()

# Default values for the range to pull. We'll 
startValue = 1
endValue = 0
artifactsMax = 242
petsMax = 246
unitsMax = 221
if args.start > 0:
	startValue = args.start

# Since Python's range() isn't inclusive, we want to increase what they provide to account for it.
if args.end is not None and (args.end + 1) > startValue:
	endValue = args.end

if args.artifacts:
	print("Will pull artifacts.")
	download_images("artifacts", startValue, endValue if endValue > 0 else artifactsMax)

if args.pets:
	print("Will pull pets.")
	download_images("pets", startValue, endValue if endValue > 0 else petsMax)

if args.units:
	print("Will pull units.")
	download_images("units", startValue, endValue if endValue > 0 else unitsMax)
