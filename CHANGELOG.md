# Changelog

## Future
### Added
- The option to delete all your data under the transfer data menu

### Changed
- The whole backend structure
- The layout of the unit page to split the units by tribe

### Fixed
- Requirement for Ancient Blessing (Forest Knight) when pet active
- Fixed highlighting of the text of the website while dragging the pet cards

## [1.5.0] - 2020-03-22
### Added
- New feature to track other pets besides shn and shh
- Checkbox to hide or show pets that are unattainable due to KL constraints
- Button that links to the new Discord support server
- Button that links to HarroweD pet guide
- Button for donations
- Animation to dropdown menus in the navbar
- A logo for the website

### Changed
- Ticket priority to be up-to-date with H17 units
- Reset priority and progress 1 day buttons are now disabled while website is busy executing them
- The layout for the stat modal for mobile devices
- The size of the meta progression image for vertical rotated mobile devices
- The location of the import and export buttons. They are now under the "Data Transfer" dropdown.
- The amount of space on mobile that is available to scroll pets
- Various other styles

### Fixed
- Slight misaligment of pet image and number of days display for the trackers
- A typo for the Barbarian Battle Cry (Orc) buff
- A typo for the Innervate 3 buff
- A bug where the width of the pet cards was not calculated properly for all screen sizes
- Various bugs that were introduced by an earlier version regardin asyncronious behavoir
- A problem when importing older versions due to IndexedDB not being able to handle booleans correctly

## [1.4.6] - 2020-03-08
### Fixed
- A bug where the multiplier for the normal units was not adjusted correctly when you had the coupled 5 star pet

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

## [1.4.0] - 2020-02-15
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
