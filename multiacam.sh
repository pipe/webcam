#!/bin/sh

./videorelay 47806 &
sleep 1

home=session.html

jjs -J-Xmx1256m -J-Dpe.pi.client.small.defaultPage=${home} -J-Djava.net.preferIPv4Stack=true -cp ./pipe-java-client-current.jar multiacam.js
