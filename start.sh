#!/bin/sh -v
cd /home/mendel
sleep 60
XDG_RUNTIME_DIR=/run/user/1000 export XDG_RUNTIME_DIR
jjs -J-Xmx256m -J-Dpe.pi.client.small.defaultPage=session.html -J-Djava.net.preferIPv4Stack=true -cp pipe-java-client-current.jar webcam/webcam.js  > pipe.out
