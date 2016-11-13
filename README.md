How to build a simple,secure,private webcam using https://pi.pe/ 's IoT toolkit.
Code and docs backing up the talk given by @steely-glint at https://www.krankygeek.com

Ingredients:

 1x Adafruit PiTFT 2.2" HAT Mini Kit - 320x240 2.2" TFT - No Touch 
 1x Raspberry Pi Camera v2.1 with mount - Standard 
 1x Raspberry Pi 3 - Raspberry Pi 3 Only 

 1x git repo (cloned from here)
 1x copy of |pipe|'s IoT beta to run on the Pi
 1x or more Chrome browsers

1) Build the pi 
plug all the bits together - soldering is required for the tft 
2) setup the OS
  a) download https://s3.amazonaws.com/adafruit-raspberry-pi/2016-10-18-pitft-22.zip
     or more or appropiate raspberian for your screen.
  b) put it on an sd card 
https://www.raspberrypi.org/documentation/installation/installing-images/
  c) ssh into the new device (or plugin a mouse/kbd)
  d) run raspi-config - 
      expand the filesystem, 
      enable the camera, 
      change the password , 
      set to login in auto as pi with a graphical user interface, 
      disable VNC 
    Then reboot.
  e) log back in - with the new password...
  f) sudo apt-get update
  g) make a link
   mknod camera.mjpeg p
   ln -s camera.mjpeg camera
  h) copy dot.xsession to .xsession
  i) 
copy pipe-java-client-1.0-SNAPSHOT.jar

reboot

(notes) 
raspivid -cd MJPEG -o camera.mjpeg -t 0 -h 360 -w 640 -fps 5
   




