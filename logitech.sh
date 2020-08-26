#!/bin/sh

./videorelay 47806 &
home=session.html
while true
do
   jjs -J-Xmx256m -J-Dpe.pi.client.small.defaultPage=${home} -cp pipe-java-client-current.jar logitech.js
   cp firmware pipe-java-client-current.jar || true
   rm -f firmware
   sleep 1
done
