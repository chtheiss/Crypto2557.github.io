BUILD_DIRECTORY="$PWD/app/build"
if [ -d "$BUILD_DIRECTORY" ]; then
	rm -r $BUILD_DIRECTORY
fi

python freeze.py

