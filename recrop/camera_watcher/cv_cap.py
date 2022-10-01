import os
import pathlib
import shutil

import cv2 as cv2

CAM_PORT = os.getenv("CAMERA_PORT", 0)
OUT_DIR = os.getenv("CAMERA_OUT_DIR", "./output/")

OUT_DIR = pathlib.Path(OUT_DIR)

if OUT_DIR.exists() and OUT_DIR.is_dir():
    pass

elif not OUT_DIR.exists():
    OUT_DIR.mkdir()


def capture(filename, redis):

    cam = cv2.VideoCapture(CAM_PORT)

    res, image = cam.read()

    if res:

        cv2.imwrite("image.png", image)
        OUT_PATH = pathlib.Path(OUT_DIR.resolve(), filename + ".png").resolve()

        shutil.copy("image.png", OUT_PATH)

        pathlib.Path("image.png").unlink()

    redis.set("cap", "none")
