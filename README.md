#How to build a simple,secure,private webcam with webRTC
## using https://pi.pe/ 's IoT toolkit.
![webcam block diag](/docs/img/overview-pipe-webcam.png)
##Code and docs backing up the talk given by @steely-glint 
##at https://www.krankygeek.com
#backgrounder video at: https://youtu.be/8zgvhL-poRQ

#Summary 
Use our API and device agent software to make a webcam with
* end-to-end encryption
* low running costs
* simple setup
* no open ports 
* accessable from a smartphone browser
* no passwords
* works on 3g, 4g, wifi etc.

For more info on the API see https://steely-glint.github.io/PipeApiDocs/

##Ingredients:

 * 1x Adafruit PiTFT 2.2" HAT Mini Kit - 320x240 2.2" TFT - No Touch 
 * 1x Raspberry Pi Camera v2.1 with mount - Standard 
 * 1x Raspberry Pi 3 -
 * 1x git repo (cloned from here)
 * 1x copy of |pipe|'s IoT beta to run on the Pi
 * 1x or more Chrome browsers

To obtain a copy of our beta software, send an email with your Pi's serial
number to me you can get the serial number with 
`awk '/^Serial/ { print $3}' < /proc/cpuinfo`

_The beta software (and associated intellectual property) is licensed for
that single Pi and not for re-distribuiton or re-use._

##Recipe
1. Build the pi
plug all the bits together - soldering is required for the tft 
2. setup the OS
  * download https://s3.amazonaws.com/adafruit-raspberry-pi/2016-10-18-pitft-22.zip
     or more or appropiate raspberian for your screen.
  * put it on an sd card
https://www.raspberrypi.org/documentation/installation/installing-images/
  * ssh into the new device (or plugin a mouse/kbd) 
     (note you may need to add a 'ssh' file in /boot to enable ssh on first boot)
  * run raspi-config -
      * expand the filesystem, 
      * enable the camera, 
      * change the password , 
      * set to login in auto as pi with a graphical user interface, 
      * disable VNC 
    Then reboot.
  * log back in - with the new password...
  * sudo apt-get update
3. setup wifi (if needed)
   ethernet links are more secure and PoE is the best way to power a PiCam
   but in some situations wifi fits the bill
   (recent rasberian versions allow you to put a wpa_supplicant.conf in /boot so it can
   connect up on first boot)
4. install and config pipe software
  * make a link and pipe for the camera
   `mknod camera.mjpeg p`
   `ln -s camera.mjpeg camera`
  * copy `dot.xsession` to `.xsession` to pi's home directory
  * copy `pipe-java-client-1.0-SNAPSHOT.jar` and `camera.sh` to pi's home directory

5. reboot

##Hosting
There are multiple options for hosting the necessary (static) web pages.
The easiest is to fork this repo to your own github account then use 'settings' 
on github to enable github-pages for the docs directory of the repo.

Other alternatives include S3, your own server etc....
Whatever you do you'll need to serve from https for the camera to work.

##Testing:
You should see a QR code on the TFT screen -
claim it using the claim.html page
it should browse to webcam.html and auto connect you.

##Lending:
If you want to access the webcam from a different computer or android phone,
you can do a lend/borrow transaction.

* On the device you used to claim the pi, browse to lend.html
* On the new device you want to add, browse to borrow.html
* Use the lend page to scan the QR shown on the borrow page.
* Now select the picam you want to lend from the pictures. (there will
probably be only one). 
* On the new device browse to camera.html and select the picam.

##Customizing:
git clone these pages and edit as you see fit.
If you switch web domains (or wipe chrome's cookies) 
you will need to re-claim the pi.
You can do this by re-booting and then press and hold the #17 button on the
TFT when asked if you want to factory reset. You'll get a new Qr - claim this
from the claim.html page in your new domain.

##Tightening up:
* check for open ports
`netstat -lnt`
-remove associated software or firewall it.
* other....
   




