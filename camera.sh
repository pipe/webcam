#!/bin/sh
date > camstart.log
raspivid -cd MJPEG -o camera.mjpeg -t 0 -h 480 -w 480 -fps 5 -rot 180   >> camstart.log
