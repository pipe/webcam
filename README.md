# How to build a simple,secure,private webcam with webRTC
## using https://pi.pe/ 's IoT toolkit.
## Code and docs backing up the talk given by @steely-glint 
## at https://www.krankygeek.com
# backgrounder video at: https://youtu.be/8zgvhL-poRQ

# THIS IS STILL a WORK IN PROGRESS issues/PRs are very welcome
# Summary 
Use our API and device agent software to make a webcam with
* end-to-end encryption
* low running costs
* simple setup
* no open ports 
* accessable from a smartphone browser
* no passwords
* works on 3g, 4g, wifi etc.

## Ingredients:

 * 1x Raspberry Pi (ideally a newer one)
 * 1x Raspberry Pi camera
 * 1x micro sd card 8GB or larger 
 * 1x or more WebRTC compatible browsers
 * Around 30 mins to 1hr


_The beta software (and associated intellectual property) is licensed for
a single Pi and not for re-distribuiton or re-use._

## Recipe
1. Build the pi
plug all the bits together 
2. setup the OS
  * Use the Raspi imager to put an OS image onto the sdcard
  * We recommend the 32 bit Lite image
https://www.raspberrypi.org/documentation/installation/installing-images/
    (if you don't have a screen and keyboard, you'll need to use the advanced options 
     to set the name of the device, configure wifi, enable ssh and add  a username/password)
  * ssh into the new device (or plugin a mouse/kbd) 
  * run sudo raspi-config -
      On bullseye you _must:
      * enable the _legacy_ camera, 
      On earlier OS's just enable the camera
      If you haven't already set these, you should also
      * rename the device, 
      * change the password, 
      * setup the wifi,
      * disable VNC 
      * enable ssh
  * reboot
  * log back in 
  * download the install script
wget https://raw.githubusercontent.com/pipe/webcam/main/install.sh
  * run the install script (which may take a while)
sh -x install.sh 
  * Once everything is installed you should see a QR code displayed
  * scan it with your iphone camera or android phone 
  * open the url in chrome or safari
  * you should see pairing messages and then a live stream on your phone.
  * now reboot the pi - the PipeCam software should restart automatically
  * your live stream is available to your phone via https://dev.pi.pe/index.html

## Lending:
If you want to access the webcam from a different computer or smartphone,
you can do a lend/borrow transaction.

* On the device you used to claim the pi, browse to https://dev.pi.pe/index.html
* Select lend your device
* Select the period you want to lend access for
* Have the other user scan the resulting QR
* They will now have access for the period you selected

## Tightening up:
* check for open ports
`netstat -lnt`
-remove associated software or enable a firewall .
* other....

