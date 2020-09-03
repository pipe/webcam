/*
 * Copyright 2018 pi.pe gmbh .
 *
 */


// Directory to password

// Bare necessities
var Log = Java.type('com.phono.srtplight.Log');
Log.setLevel(Log.INFO); // VERB, DEBUG,INFO, WARN , ERROR 
var App = Java.type('pe.pi.client.small.App'); // base type for a device that receives connections
var SmallScreen = Java.type('pe.pi.client.small.screen.SmallScreen');
var BiFunc = Java.type('java.util.function.BiFunction');
var AVMux = Java.type('pe.pi.client.av.AVMux');
var LocalRTPRepeater = Java.type('pe.pi.client.av.LocalRTPRepeater');
var RTPRepeater = Java.type('pe.pi.client.av.RTPRepeater');

// Endpoints that will be available to the remote user
var BiAVRelayMux = Java.type('pe.pi.client.endpoints.rtmedia.BiAVRelayMux');
//var AudioVideoRelayMux = Java.type('pe.pi.client.endpoints.rtmedia.AudioVideoRelayMux');
var WebsocketEndpoint = Java.type('pe.pi.client.endpoints.proxy.WebsocketEndpoint');
var ErrorEndpoint = Java.type('pe.pi.client.device.endpoints.core.ErrorEndpoint');
var RTPMarkedDataSink = Java.type('pe.pi.client.av.RTPMarkedDataSink');
var HttpEndpoint = Java.type('pe.pi.client.endpoints.proxy.HttpEndpoint');
var TermEndpoint = Java.type('pe.pi.client.endpoints.proxy.TermEndpoint');
var FileRecv= Java.type('pe.pi.client.device.endpoints.core.FileRecv');



// Other classes we will configure
var OpusCodec = Java.type('com.phono.audio.codec.OpusCodec');
var JksCertHolder = Java.type('pe.pi.client.base.certHolders.JksCertHolder');
var SliceConnect = Java.type('pe.pi.client.small.SliceConnect');
var DataInputStream = Java.type('java.io.DataInputStream');
var File = Java.type('java.io.File');
var FileInputStream = Java.type('java.io.FileInputStream');


SliceConnect.STUNURI= "stun:gont.westhawk.co.uk:3478"; // setup the stun URI

// params used in this script
var EC = false; // enable echo supression
var homedir = "."; //sets CWD for bulk of actions

App.prefixUrl = "https://dev.pi.pe/claim.html";
//App.prefixUrl = "http://localhost:8888/ppp/docs/claim.html";
// if you don't have an actual sceeen, you can intercept messages and status here
var screen = new SmallScreen(){
    init: function () {},
    clearScreen: function () {},
    drawQr: function (q) {
        Log.info("Pair uri is " + q);
    },
    showMessage: function (message) {
        Log.info("Message:" + message)
    },
    setStatus: function (ind, string) {
        // you can hook status indications into here.
        Log.info("Status [" + ind + "]=" + string)
    }
}

var avmux = new AVMux(47806); // starts listening for video frames on this port
//avmux.setVCodec("VP8");
avmux.startListening(EC); // open audio listener on alsa (with Echo supression)
var localVideoRTP = new LocalRTPRepeater(1234,96); // echo video to local port
avmux.addVideoSub(localVideoRTP); //subscribe for video feed
var screenVideoRTP = new RTPRepeater("192.168.100.60",1236,96); // echo video to local port


// function that maps between the label of a requested datachannel and 
// the class it will connect to (if any).
// notice that this uses string constants and switch _not_ regexps or
// dynamic class loading - this for security purposes - no chance of whacky
// i18n 2byte matches in regexps or ../.. paths etc.
// for extra security, create an equivelent java class and compile it.
var mapper = new BiFunc(){
    apply: function (l, s) {
        Log.info("mapping Datachannel label: " + l + ", s: " + s);
        var ret = null;
        try {
            switch (l) {
	        case 'firmware':
                    ret= new FileRecv(l,s,screen);
                    ret.setShutdown(true);
                    break;
                case 'videorelay':
                case 'avrelay':
                    Log.debug("Creating " + l);
                    ret = new BiAVRelayMux(s, l, screen,avmux);
	            ret.setRTPRepeater(screenVideoRTP);
                    break;
                case 'http://localhost:8181/':
                    ret = new HttpEndpoint(s, l, screen);
                    break;
                case 'term':
                    Log.warn("Creating " + l);
                    ret = new TermEndpoint(l, s);
                    break;
            }
        } catch (err) {
            // Catch any failures and return to null
            //  so that at least it can continue.
            Log.info("Error: Failed to map datachannel:");
            Log.info("    " + err);
            ret = null;
        }
        return ret;
    }
}

// kick stuff off...
App.connectOnce(screen, mapper, homedir, false);
