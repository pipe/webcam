#!/bin/sh -v
## enable camera
## reboot


sudo apt-get update 
sudo apt-get upgrade -y

JAVANUM='11'
if [ `uname -m` = "armv6l" ]
then
   echo "Sorry, you need to manually install a suitable JDK 11 that supports armv6l (older pi's)- try azul.com"  
   exit
fi
JDK=`printf "openjdk-%s-jre-headless" $JAVANUM`
echo JDK to install is  $JDK

sudo apt-get install -y galternatives $JDK git

sync;

cd ~

git clone https://github.com/pipe/webcam.git

cd webcam
ln -s `pwd`/videorelay ~/videorelay
ln -s `pwd`/pipe-java-client-1*.jar ~/pipe-java-client-current.jar 
cd ~

sudo cp webcam/rc.local /etc/rc.local
webcam/firstCam.sh

echo done. 
