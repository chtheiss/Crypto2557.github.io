# Endless Farming

This is the code for the Endless Farming website.

You may [submit an issue](https://github.com/Crypto2557/Crypto2557.github.io/issues) or [open a pull request](https://github.com/Crypto2557/Crypto2557.github.io/pulls) at any time.

## License

The Endless Farming Project is licensed under the terms of the GNU Affero General Public License 3.0 ("AGPL").

[AGPL for humans](<https://tldrlegal.com/license/gnu-affero-general-public-license-v3-(agpl-3.0)>)

## Work in Progress

- [ ] Ob tracking (show rotation time, days till 5* based on current max stage, possibly best team based on owned units)
- [ ] Add Information for non sh pets
- [ ] Slab tracking
- [ ] Integration of Spirit Highland solutions
- [ ] Normal Registration/Login and authentication with Discord to access and edit your data everywhere
- [x] Design and Layout Rework
- [ ] Connected Discord bot with shared functionality
- [x] Performance optimization

## Running it
### Setup
- (Optional) Create a virtual environment: `conda env create -f environment.yml` or install Python 3
- (Optional) Activate your environment: `conda activate endlessfarming`
- Install general and developer requirements: `pip install -r requirements.txt -r requirements-dev.txt`
- (Development) pre-commit install

### Run Locally
- Set the path of the flask application:
	-(Linux) `export FLASK_APP=app/farming.py`
	-(Windows) `set FLASK_APP=app/farming.py`
- Start the application: `flask run`
- You can visit it in the browser at `localhost:5000`