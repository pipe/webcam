#!/bin/sh
date > camstart.log
raspivid -cd MJPEG -o camera.mjpeg -t 0 -h 360 -w 640 -fps 5  -rot 180   >> camstart.log
