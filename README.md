# How to build a simple,secure,private webcam with webRTC
## using https://pi.pe/ 's IoT toolkit.
![webcam block diag](/docs/img/overview-pipe-webcam.png)
## Code and docs backing up the talk given by @steely-glint 
## at https://www.krankygeek.com
# backgrounder video at: https://youtu.be/8zgvhL-poRQ

# Summary 
Use our API and device agent software to make a webcam with
* end-to-end encryption
* low running costs
* simple setup
* no open ports 
* accessable from a smartphone browser
* no passwords
* works on 3g, 4g, wifi etc.

For more info on the API see https://steely-glint.github.io/PipeApiDocs/
## UPDATE
 * This version supports iOS and android devices
 * it also supports experimental bandwidth estimation - so the video quality will ramp up
   to the capacity of the link.
 * this requires a compiled version of the gstreamer video relay
## Ingredients:

 * 1x HDMI screen or xwindows capable display e.g.
   Adafruit PiTFT 2.2" HAT Mini Kit - 320x240 2.2" TFT - No Touch 
  
 * 1x micro sd card 8GB or larger 
 * 1x Raspberry Pi 
 * 1x Raspberry Pi camera
 * 1x git repo (cloned from here)
 * 1x copy of |pipe|'s IoT beta to run on the Pi
 * 1x or more WebRTC compatible browsers
 * Around 30 mins to 1hr

To obtain a copy of our beta software, send an email with your Pi's serial
number to me. You can get the serial number with 
`awk '/^Serial/ { print $3}' < /proc/cpuinfo`

_The beta software (and associated intellectual property) is licensed for
that single Pi and not for re-distribuiton or re-use._

## Recipe
1. Build the pi
plug all the bits together - soldering is required for the tft 
2. setup the OS
  * download a recent copy of raspberian (not lite)
  * put it on an sd card
https://www.raspberrypi.org/documentation/installation/installing-images/
  * ssh into the new device (or plugin a mouse/kbd) 
     (note you may need to add a 'wpa_supplicant.conf' and 'ssh' file in /boot to enable wifi/ssh on first boot)
    ssh pi@raspberrypi.local (assuming you only have one)
  * run raspi-config -
      * rename the device, 
      * enable the camera, 
      * change the password , 
      * set to login in auto as pi with a graphical user interface, 
      * disable VNC 
  * configure the screen (if isn't HDMI)
  * reboot
  * log back in - with the new password...
  * sudo apt-get update
3. setup wifi (if needed)
   ethernet links are more secure and PoE is the best way to power a PiCam
   but in some situations wifi fits the bill
   (recent Rasberian versions allow you to put a wpa_supplicant.conf in /boot so it can
   connect up on first boot)
4. install and config software
   * see installSteps.txt
5. reboot

## Hosting - none
This is the |pipe| magic - the web interface is stored on your pi
but protected so only you and people you lend access to can see it.
You can edit the docs/static/session_body.html file to change the behaviour.


## Testing:
* You should see a QR code on the TFT screen -
* Scan it with a qr code reader on your smartphone.
  (on iOS if you say 'hey Siri scan this QR' your phone will open the camera app and let you scan the QR displaying a safari link)
* Or you can use https://dev.pi.pe/scan.html in chrome/safari
* The devices should pair and take you to the webcam interface

## Lending:
If you want to access the webcam from a different computer or smartphone,
you can do a lend/borrow transaction.

* On the device you used to claim the pi, browse to https://dev.pi.pe/index.html
* Select lend your device
* Select the period you want to lend access for
* Have the other user scan the resulting QR
* They will now have access

## Tightening up:
* check for open ports
`netstat -lnt`
-remove associated software or firewall it.
* other....

