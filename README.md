# Endless Farming

This is the code for the Endless Farming website.

You may [submit an issue](https://github.com/Crypto2557/Crypto2557.github.io/issues) or [open a pull request](https://github.com/Crypto2557/Crypto2557.github.io/pulls) at any time.

## License

The Endless Farming Project is licensed under the terms of the GNU Affero General Public License 3.0 ("AGPL").

[AGPL for humans](<https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)>)

## Running it
### Setup
- (Optional) Create a virtual environment: `conda create -f environment.yml` or install Python 3
- (Optional) Activate your environment: `conda activate endlessfarming`
- Install general and developer requirements: `pip install -r requirements.txt -r requirements-dev.txt`

### Run Locally
- Set the path of the flask application:
	-(Linux) `export FLASK_APP=app/farming.py`
	-(Windows) `set FLASK_APP=app/farming.py`
- Start the application: `flask run`
- You can visit it in the browser at `localhost:5000`
