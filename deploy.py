import os
import shutil

from app import farming


def savermtree(path):
    if os.path.isdir(path):
        shutil.rmtree(path)


def saveremove(path):
    if os.path.isfile(path):
        os.remove(path)


def main():
    build_dir = "app/build"
    # Make sure the build directory is empty
    savermtree(build_dir)
    os.mkdir(build_dir)

    # Build a static version of the application
    farming.freezer.freeze()

    # Remove the old version
    subfolders = ["pets", "pets_hard", "static", "tickets", "units", "meta_progression"]
    for folder in subfolders:
        savermtree(folder)
    saveremove("index.html")
    saveremove("jsglue.js")

    # Move the new version to the base directory
    for folder in subfolders:
        shutil.move(os.path.join(build_dir, folder), folder)

    shutil.move(os.path.join(build_dir, "index.html"), "index.html")
    shutil.move(os.path.join(build_dir, "jsglue.js"), "jsglue.js")

    # Remove the build directory
    savermtree("app/build")


if __name__ == "__main__":
    main()
