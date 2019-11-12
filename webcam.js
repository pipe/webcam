/*
 * Copyright 2018 pi.pe gmbh .
 *
 */

// Bare necessities
var Log = Java.type('com.phono.srtplight.Log');
Log.setLevel(Log.DEBUG); // VERB, DEBUG,INFO, WARN , ERROR 
var App = Java.type('pe.pi.client.small.App'); // base type for a device that receives connections
var SmallScreen = Java.type('pe.pi.client.small.screen.SmallScreen');
var BiFunc = Java.type('java.util.function.BiFunction');
var AVMux = Java.type('pe.pi.client.av.AVMux');

// Endpoints that will be available to the remote user
var VideoRelay = Java.type('pe.pi.client.endpoints.rtmedia.VideoRelay');
var HttpEndpoint = Java.type('pe.pi.client.endpoints.proxy.HttpEndpoint');
var TermEndpoint = Java.type('pe.pi.client.endpoints.proxy.TermEndpoint');


// Other classes we will configure
var JksCertHolder = Java.type('pe.pi.client.base.certHolders.JksCertHolder');
var SliceConnect = Java.type('pe.pi.client.small.SliceConnect');

//settings on some of those classes
App.WSURI = "wss://pi.pe/websocket/?finger="; // and the rendezvous websocket.
App.prefixUrl = "https://dev.pi.pe/claim.html";

// params used in this script
var EC = true; // enable echo supression
var homedir = "."; //sets CWD for bulk of actions

// if you don't have an actual sceeen, you can intercept messages and status here
var screen = new SmallScreen(){
    init: function () {},
    clearScreen: function () {},
    drawQr: function (q) {
        Log.info("My id and nonce are " + q);
    },
    showMessage: function (message) {
        Log.info("Message:" + message)
    },
    setStatus: function (ind, string) {
        // you can hook status indications into here.
        Log.info("Status [" + ind + "]=" + string)
    }
}

//var avmux = new AVMux(47806); // starts listening for video frames on this port

//avmux.startListeningV(); // open audio listener on alsa (with Echo supression)

// function that maps between the label of a requested datachannel and 
// the class it will connect to (if any).
// notice that this uses string constants and switch _not_ regexps or
// dynamic class loading - this for security purposes - no chance of whacky
// i18n 2byte matches in regexps or ../.. paths etc.
// for extra security, create an equivelent java class and compile it.
var mapper = new BiFunc(){
    apply: function (l, s) {
        Log.info("mapping Datachannel label");
        var ret = null;
        switch (l) {
            case 'term': 
	        ret = new TermEndpoint(l,s);
                break;
            case 'http://localhost:8181/': 
	        ret = new HttpEndpoint(s, l, screen);
                break;
            case 'videorelay':
            case 'rvr':
            case 'video-only':
            case 'videodrive':
                Log.debug("Creating " + l);
                ret = new VideoRelay(s, l, screen);
		ret.setBweFileQ("bwe");
                break;
        }
        return ret;
    }
}
// kick stuff off...
App.connectOnce(screen, mapper, homedir, false);
