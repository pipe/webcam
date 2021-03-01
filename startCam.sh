#!/bin/sh
cd $HOME
nohup java -Xmx128m -jar pipe-java-client-current.jar > /dev/null &

