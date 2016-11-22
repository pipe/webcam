#!/bin/sh
date > camstart.log
avconv -f video4linux2 -input_format mjpeg -y -r 1 -s 640x360 -i /dev/video0 ./camera.mjpeg >>camstart.log 
