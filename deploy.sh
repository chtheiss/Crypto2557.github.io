BUILD_DIRECTORY="$PWD/app/build"
if [ -d "$BUILD_DIRECTORY" ]; then
	rm -r $BUILD_DIRECTORY
fi

python freeze.py
for FILE in $(find $BUILD_DIRECTORY/static/js/*.js)
do
	uglifyjs $FILE -o $FILE
done

cleancss -o $BUILD_DIRECTORY/static/css/ef.css $BUILD_DIRECTORY/static/css/ef.css
cleancss -o $BUILD_DIRECTORY/static/css/normalize.css $BUILD_DIRECTORY/static/css/normalize.css

rsync -a $BUILD_DIRECTORY/* $PWD 
rm -r $BUILD_DIRECTORY
