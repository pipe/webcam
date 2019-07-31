#!/bin/sh

./videorelay 47806 &
sleep 1
file="audioPipe"
if [ -p "$file" ]
then
       echo "$file found."
else
       echo "make pipe for |pipe| $file"
        mkfifo $file
fi

home=session.html

jjs -J-Xmx256m -J-Dpe.pi.client.small.defaultPage=${home} -J-Djava.net.preferIPv4Stack=true -cp ~/pipe-java-client-current.jar awebcam.js
