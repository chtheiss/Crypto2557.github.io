# Endless Frontier Pet and Unit Tracker

## Setup
1. Install Python 3, if not already installed.
2. Run `pip3 install -r requirements.txt` in the root directory.

## Updating Images
If new pets, units, or artifacts are released you'll need to pull them down from the [Endless Frontier Data][ef-data] community site.

1. Run `python3 images-updater.py`, passing arguments as needed. For example:
	1. `python3 image-updater.py -a` will pull down all artifact images.
	2. `python3 image-updater.py -p` will pull down all pet images.
	3. `python3 image-updater.py -p -s 1 -e 2` will pull down the first two pet images.
	4. `python3 image-updater.py -u` will pull down all unit images.
	5. Run `python3 image-updater.py -h` to see all available options.
2. Once the script has completed, handle any failures and move all of the generated png files to the appropriate directory in .\static\img\.

[ef-data]: https://www.endlessfrontierdata.com/
