# Changelog

## Future
### Added
- New Pets for H1 of 7* Units
- Visual cue for units similar to in-game look
- Task list to README

### Changed
- Templates to work with css grid instead of bootstrap (that made the code much for readable)
- Css to work with all the new classes
- Js code to work with the restructutred website
- Performance optimizations for the all parts of the code

### Fixed
- A bug where not the correct number of requirement units was shown for unit which rely on pets of
other units determine their requirement
- A bug that shrank the pet area when only very few pets remained for tracking (almost all pets 5 star)
- A bug with the navbar on the Metas page

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
