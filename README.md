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

 * 1x HDMI screen or xwindows capable display e.g.
   Adafruit PiTFT 2.2" HAT Mini Kit - 320x240 2.2" TFT - No Touch 
 * 1x micro sd card 8GB or larger 
 * 1x Raspberry Pi 
 * 1x Raspberry Pi camera
 * 1x or more WebRTC compatible browsers
 * Around 30 mins to 1hr


_The beta software (and associated intellectual property) is licensed for
a single Pi and not for re-distribuiton or re-use._

## Recipe
1. Build the pi
plug all the bits together - soldering is required for the tft 
2. setup the OS
  * download a recent copy of Raspberry Pi OS lite 
  * put it on an sd card
https://www.raspberrypi.org/documentation/installation/installing-images/
  * ssh into the new device (or plugin a mouse/kbd) 
     (note you may need to add a 'wpa_supplicant.conf' and 'ssh' file in /boot to enable wifi/ssh on first boot)
    ssh pi@raspberrypi.local (assuming you only have one)
  * run raspi-config -
      * rename the device, 
      * enable the camera, 
      * change the password, 
      * setup the wifi,
      * disable VNC 
      * enable ssh
  * reboot
  * log back in - with the new password...
  * download the install script
wget https://raw.githubusercontent.com/pipe/webcam/main/install.sh
  * run the install script (which may take a while)
sh -x install.sh 
  * This takes quite a while (~10 mins depending on your internet/pi/sdcard) 
  * Once everything is installed you should see a QR code displayed
  * scan it with your iphone camera or android phone 
  * open the url in chrome or safari
  * you should see pairing messages and then a live stream on your phone.

## Lending:
If you want to access the webcam from a different computer or smartphone,
you can do a lend/borrow transaction.

* On the device you used to claim the pi, browse to https://dev.pi.pe/index.html
* Select lend your device
* Select the period you want to lend access for
* Have the other user scan the resulting QR
* They will now have access
* This Eval version supports only one viewer at a time

## Tightening up:
* check for open ports
`netstat -lnt`
-remove associated software or enable a firewall .
* other....

