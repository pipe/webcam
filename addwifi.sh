#!/bin/sh
# takes 2 arguments - ssid and passphrase
# first check if we are already connected:
wget --connect-timeout 1 -t 1 -q --method HEAD https://dev.pi.pe/
connected=$?
if [ $connected ];
then
  echo "connected"
else
  echo "not connected"
fi

#now test if we already know about this ssid
knownSSID=`wpa_cli -i wlan0 list_networks | awk  -vssid=$1 '$2==ssid { print $1 }'`
echo $knownSSID
if [ -n "$knownSSID" ];
then 
   echo "update pass only"
   wpa_cli -i wlan0 set_network $knownSSID psk \"$2\" 
   wpa_cli -i wlan0 enable_network $knownSSID
   wpa_cli -i wlan0 select_network $knownSSID
else 
   echo "add network entry"
   newNet=`wpa_cli -i wlan0 add_network`
   echo "newnet is $newNet"
   wpa_cli -i wlan0 set_network $newNet ssid \"$1\"
   wpa_cli -i wlan0 set_network $newNet psk \"$2\" 
   wpa_cli -i wlan0 enable_network $newNet
   wpa_cli -i wlan0 select_network $newNet
fi
wpa_cli -i wlan0 list_networks
wpa_cli -i wlan0 save_config


