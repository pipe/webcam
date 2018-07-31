#!/bin/sh -v
xset s off         # don't activate screensaver
xset -dpms         # disable DPMS (Energy Star) features.
xset s noblank     # don't blank the video device
xmessage -timeout 10 `hostname -I` 
bright=1000
gpio -g mode 18 pwm
gpio -g pwm 18 $bright
xmessage -timeout 5 -buttons "Yes:1,No:0" "Factory Reset?"
reset=$?
gpio -g mode 17 up
pinval=`gpio -g read 17`
if [ $pinval -eq "0" ]
then
  reset=1 
fi
if [ $reset -eq "1" ]
then
xmessage -timeout 5 "Reset ownership"
echo secret | keytool -delete -alias master -keystore ipsecert.ks
fi
date > pipe.out
gpio -g mode 22 up
pinval=`gpio -g read 22`
while [ $pinval -ne 0 ]
do
jjs -J-Xmx256m -J-Dpe.pi.client.small.defaultPage=install.html -J-Djava.net.preferIPv4Stack=true -cp pipe-java-client-1.0.4.jar webcam.js  > pipe.out
pinval=`gpio -g read 22`
done
