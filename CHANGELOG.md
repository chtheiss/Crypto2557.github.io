# Changelog

## [1.4.5] - 2020-03-07
### Fixed
- A bug that prevented own priorities to be saved to the IndexedDB (please reset and reorder if you used that feature)

## [1.4.4] - 2020-03-07
### Added
- New H1 of 7* units
- Hidden skills to H1 7* pets

### Changed
- Visual revision of the website (color scheme, unification, etc.)
- Made dragging pets a bit more responsive for Chrome users

### Fixed
- A bug where the days to complete the pets were not shown for hard sh

### Removed
- Home nav link

## [1.4.3] - 2020-03-06
### Added
- New Pets for H1 of 7* units
- Visual cue for units similar to in-game look
- Task list to README

### Changed
- Templates to work with css grid instead of bootstrap (that made the code much for readable)
- Css to work with all the new classes
- Js code to work with the restructured website
- Performance optimizations for the entire codebase
- Made the import button reload the page after successfully loading the data

### Fixed
- A bug where not the correct number of requirement units was shown for units which rely on pets of
other units to determine their requirement
- A bug that shrank the pet area when only very few pets remained for tracking (almost all pets 5 star)
- A bug with the navbar on the Metas page
- A bug where the "Endless Farming" link in the navbar did not redirect to the index page

### Removed
- Poll from main page

## [1.4.2] - 2020-02-20
### Added
- Future features poll
- Description for the website

### Removed
- Important notice on home page

## [1.4.1] - 2020-02-16
### Changed
- Meta progression

## [1.4] - 2020-02-15
### Added
- GNU Affero General Public License 3.0
- Changelog
- Code of Conduct
- Readme
- Development Dependencies
- Deployment script
- Config file for formatters
- Various development tools

### Changed
- Formatted all Python code with black
- Removed build/ from .gitignore
- Email contact on main page
- Trimmed environment.yml

### Removed
- File to only freeze the flask application
- Unnecessary _config.yml
- Unnecessary main.py
- Old reddit link (will add new one next patch)

### Fixed
- Hard Spirit Highland pets and priority
