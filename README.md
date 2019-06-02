# Endless Frontier Pet and Unit Tracker

## Setup
1. Install Python 3, if not already installed.
2. Run `pip3 install -r requirements.txt` in the root directory.

## Updating Units
1. Edit images.py with the current unit range.
2. Run `python3 images.py`.
3. Once the script has completed, handle any failures and move all of the generated png files to the .\static\img\units directory.

## Updating Pets
1. Edit images.py with the current pet range, and change `units` in the URL to `pets`.
2. Run `python3 images.py`
3. Once the script has completed, handle any failures and move all of the generated png files to the .\static\img\pets directory.
