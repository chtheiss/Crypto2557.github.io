import os
import urllib.request
import argparse
from enum import Enum
from tqdm import tqdm

parser = argparse.ArgumentParser(
    description="Image Crawler for units, pets, and artifacts"
)
parser.add_argument(
    "-d",
    "--dir",
    help="Base path for saving the images.",
    type=str,
    default="app/static/img/",
)
parser.add_argument(
    "-a", "--artifacts", help="Will update artifact images", action="store_true"
)
parser.add_argument("-p", "--pets", help="Will update pet images.", action="store_true")
parser.add_argument(
    "-u", "--units", help="Will update unit images.", action="store_true"
)
parser.add_argument(
    "-s", "--start", help="Set the start number. Defaults to 1.", type=int, default=1
)
parser.add_argument("-e", "--end", help="Set the end number.", type=int, default=0)


class ImageType(Enum):
    UNITS: str = "units"
    PETS: str = "pets"
    ARTIFACTS: str = "artifacts"

    def __str__(self):
        return str(self.value)


def download_and_write_image(
    filename: str, imagetype: str, number: int, animated: bool = False
):
    f = open(filename, "wb")
    f.write(
        urllib.request.urlopen(
            f"https://www.endlessfrontierdata.com/images/"
            f"{imagetype}/{number}{'a'*animated}"
        ).read()
    )
    f.close()


def download_images(
    base_path: str,
    imagetype: str,
    startnumber: int,
    endnumber: int,
    animated: bool = False,
):
    """ Downloads select images from the Endless Frontier Data site.
    Args:
        imagetype (str): Type of image to download. One of: artifacts, pets, units.
        startnumber (int): Number of the first image to download.
        endnumber (int): Number of the last image to download.
    """
    if not os.path.isdir(base_path):
        print(f"Creating path: {base_path}")
        os.mkdir(base_path)

    failed_files = []

    for i in tqdm(range(startnumber, endnumber + 1)):
        filename = os.path.join(base_path, f"{i}.png")
        try:
            download_and_write_image(filename, imagetype, i, animated)
        except:
            if animated:
                try:
                    download_and_write_image(filename, imagetype, i)
                except:
                    print(f"failed {i}")
                    failed_files.append(filename)
            else:
                print(f"failed {i}")
                failed_files.append(filename)

    print(f"Removing {len(failed_files)} failed files.")
    for file in failed_files:
        os.remove(file)


def main():
    args = parser.parse_args()
    if args.artifacts is False and args.pets is False and args.units is False:
        print(
            "You must specify whether you want to pull artifact, pet, or unit images."
        )
        parser.print_help()
        exit()

    # Default values for the range to pull
    MAX_ARTIFACTS: int = 310
    MAX_PETS: int = 330
    MAX_UNITS: int = 241

    if args.artifacts:
        print("Will pull artifacts.")
        download_images(
            os.path.join(args.dir, str(ImageType.ARTIFACTS)),
            ImageType.ARTIFACTS,
            args.start,
            args.end if args.end > 0 else MAX_ARTIFACTS,
        )

    if args.pets:
        print("Will pull pets.")
        download_images(
            os.path.join(args.dir, str(ImageType.PETS)),
            ImageType.PETS,
            args.start,
            args.end if args.end > 0 else MAX_PETS,
        )
        download_images(
            os.path.join(args.dir, "animated_pets"),
            ImageType.PETS,
            args.start,
            args.end if args.end > 0 else MAX_PETS,
            True,
        )

    if args.units:
        print("Will pull units.")
        download_images(
            os.path.join(args.dir, str(ImageType.UNITS)),
            ImageType.UNITS,
            args.start,
            args.end if args.end > 0 else MAX_UNITS,
        )


if __name__ == "__main__":
    main()
