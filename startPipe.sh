#!/bin/sh -v
cd /home/pi
# temp hack for demos.
echo secret | keytool -delete -alias master -keystore ipsecert.ks
# also zap wifi ?
nohup jjs -J-Xmx256m -J-Dpe.pi.client.small.defaultPage=session.html -J-Djava.net.preferIPv4Stack=true -cp pipe-java-client-current.jar webcam/noscreen.js  > pipe.out &
