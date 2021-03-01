#!/bin/sh -v
## enable camera
## reboot

sudo apt-get update
sudo apt-get upgrade
sudo apt-get install -y galternatives openjdk-8-jre-headless

sudo apt-get install -y libgstreamer1.0-0 gstreamer1.0-plugins-base \
   gstreamer1.0-plugins-good gstreamer1.0-plugins-bad \
   gstreamer1.0-tools autoconf automake libtool pkg-config\
   libgstreamer1.0-dev \
   libgstreamer-plugins-base1.0-dev libraspberrypi-dev \
   git 

sync;

git clone https://github.com/thaytan/gst-rpicamsrc.git
cd gst-rpicamsrc
libtoolize
cp ../ltnain.sh .
./autogen.sh --prefix=/usr --libdir=/usr/lib/arm-linux-gnueabihf/
make
sudo make install 
cd ~

git clone https://github.com/pipe/webcam.git

cd webcam
ln -s `pwd`/videorelay ~/videorelay
cd gstrelay
gcc -DRPICAMSRC videorelay.c -o gstbin `pkg-config --cflags --libs gstreamer-1.0`
cd ~
ln -s webcam/pipe-java-client-1*.jar pipe-java-client-current.jar 

sudo cp webcam/rc.local /etc/rc.local
webcam/firstCam.sh

echo done. 
