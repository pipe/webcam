#!/bin/sh
v4l2-ctl -d /dev/video0 \
 --set-fmt-video width=1024,height=768,pixelformat=4 \
 --set-ctrl video_bitrate=768000,h264_level=9,h264_profile=1,horizontal_flip=1,vertical_flip=0,\
repeat_sequence_header=1,h264_i_frame_period=1800
cd $HOME
nohup java -Xmx128m -jar pipe-java-client-current.jar > /dev/null &

