#!/bin/sh -v
xmessage -timeout 10 `hostname -I` 
#xmessage -timeout 10 -buttons 20%:200,40%:400,60%:600,80%:800,100%:1000 "Screen brightness"
#bright=$?
#echo $bright
#if [ $bright -eq "0" ] 
#then
# echo setting bright to 1000
bright=1000
#fi
#echo $bright
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
jjs -J-Xmx256m -J-Djava.net.preferIPv4Stack=true -cp pipe-java-client-1.0.4.jar webcam.js  > pipe.out
pinval=`gpio -g read 22`
done
