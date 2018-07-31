/*
 * Copyright 2018 pi.pe gmbh .
 *
 */

// Bare necessities
var Log = Java.type('com.phono.srtplight.Log');
Log.setLevel(Log.DEBUG); // VERB, DEBUG,INFO, WARN , ERROR 
var App = Java.type('pe.pi.client.small.App'); // base type for a device that receives connections
var BiFunc = Java.type('java.util.function.BiFunction');

// Endpoints that will be available to the remote user
var VideoRelay = Java.type('pe.pi.client.endpoints.rtmedia.VideoRelay');
var HttpEndpoint = Java.type('pe.pi.client.endpoints.proxy.HttpEndpoint');

// Other classes we will configure
var JksCertHolder = Java.type('pe.pi.client.base.certHolders.JksCertHolder');

//settings on some of those classes

// params used in this script
var homedir = "."; //sets CWD for bulk of actions

// if you don't have an actual sceeen, you can intercept messages and status here
var screen = App.mkScreen();
App.prefixUrl = "https://pi.pe/p/cl.html";

//var avmux = new AVMux(47806); // starts listening for video frames on this port


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
            case 'http://localhost:8181/': 
                ret = new HttpEndpoint(s, l, screen);
                break;
            case 'videorelay':
                Log.debug("Creating " + l);
                ret = new VideoRelay(s, l, screen);
                break;
        }
        return ret;
    }
}
// kick stuff off...
App.connectOnce(screen, mapper, homedir, false);
