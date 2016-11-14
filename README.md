How to build a simple,secure,private webcam using https://pi.pe/ 's IoT toolkit.
Code and docs backing up the talk given by @steely-glint at https://www.krankygeek.com

Ingredients:

 1x Adafruit PiTFT 2.2" HAT Mini Kit - 320x240 2.2" TFT - No Touch 
 1x Raspberry Pi Camera v2.1 with mount - Standard 
 1x Raspberry Pi 3 - Raspberry Pi 3 Only 

 1x git repo (cloned from here)
 1x copy of |pipe|'s IoT beta to run on the Pi
 1x or more Chrome browsers

To obtain a copy of our beta software, send an email with your Pi's serial
number to me you can get the serial number with 
awk '/^Serial/ { print $3}' < /proc/cpuinfo

The beta software (and associated intelectual property) is licensed for
that single Pi and not for re-distribuiton or re-use.


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
3) setup wifi (if needed)
   ethernet links are more secure and PoE is the best way to power a PiCam
   but in some situations wifi fits the bill
4) install and config pipe software
  a) make a link and pipe for the camera
   mknod camera.mjpeg p
   ln -s camera.mjpeg camera
  b) copy dot.xsession to .xsession to pi's home directory
  c) copy pipe-java-client-1.0-SNAPSHOT.jar and camera.sh to pi's home directory

reboot

Testing: 
You should see a QR code on the TFT screen -
claim it using the claim.html page
now browse to camera.html - click on the image of the camera

Lending:
If you want to access the webcam from a different computer or android phone,
you can do a lend/borrow transaction.

On the device you used to claim the pi, browse to lend.html
On the new device you want to add, browse to borrow.html
Use the lend page to scan the QR shown on the borrow page.
Now select the picam you want to lend from the pictures. (there will
probably be only one). 
On the new device browse to camera.html and select the picam.

Customizing:
git clone these pages and edit as you see fit.
If you switch web domains (or wipe chrome's cookies) 
you will need to re-claim the pi.
You can do this by re-booting and then press and hold the #17 button on the
TFT when asked if you want to factory reset. You'll get a new Qr - claim this
from the claim.html page in your new domain.

Tightening up:
a) check for open ports
netstat -lnt
-remove associated software or firewall it.
b) other....
   




