/*
 * Copyright 2018 pi.pe gmbh .
 *
 */

var Log = Java.type('com.phono.srtplight.Log');
Log.setLevel(Log.DEBUG); // VERB, DEBUG,INFO, WARN , ERROR 
var App = Java.type('pe.pi.client.small.App'); // base type for a device that receives connections
var SmallScreen = Java.type('pe.pi.client.small.screen.SmallScreen');
var CertHolder = Java.type('pe.pi.client.base.certHolders.CertHolder');
// Endpoints that will be available to the remote user
var VideoRelay = Java.type('pe.pi.client.endpoints.rtmedia.VideoRelay');
var HttpEndpoint = Java.type('pe.pi.client.endpoints.proxy.HttpEndpoint');
var AssociationListener = Java.type('pe.pi.sctp4j.sctp.AssociationListener');
var BiFunc = Java.type('java.util.function.BiFunction');
var Function = Java.type('java.util.function.Function');
var QRDecoder = Java.type('pe.pi.util.QRDecoder');


var Paths = Java.type('java.nio.file.Paths');
var Files = Java.type('java.nio.file.Files');

var Thread = Java.type('java.lang.Thread');

var mapper = new BiFunc(){
    apply: function (l, s) {
        Log.warn("mapping Datachannel label "+ l);
        var ret=null;
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

var ass = null;
var tickSt;
var deviceSt;


var assocListener = new AssociationListener(){
    onAssociated: function (a) {
        var peer = a.getPeerId();
        Log.warn("Associated " + peer); 
    },
    onDisAssociated: function (a) {
        var peer = a.getPeerId();
        Log.warn("DisAssociated " + peer);
    },
    onDCEPStream: function (s, l, t) {
        // never called - we want the mapper to do this
    },
    onRawStream: function (s) {
        // absolutely never called - we want the stack to do this
    }
}
var lendQR =""; 
var screen = new SmallScreen(){
    init: function () {},
    clearScreen: function () {//swing.clearScreen()
    },
    drawQr: function (q) {
        lendQR = q;
        Log.warn("QR: " + q);
    },
    showMessage: function (message) {
        //swing.showMessage(message);
    },
    setStatus: function (ind, stat) {
         Log.warn(ind+":"+stat);
    }
}



App.prefixUrl = "https://dev.pi.pe/index.html";
var qr = new QRDecoder();
var pairId = null;
var pairNonce = null;
var wifi = null;
qr.gotQR = new Function(){
    apply: function (qr) {
        Log.debug("QR: " + qr);
        if (qr.startsWith("{")){
            wifi= qr;
        } else {
            var bits = qr.split(":");
            if (bits.length == 2){
               pairId = bits[0];
               pairNonce = bits[1];
            }
        }
        return ((pairId != null)&&(pairNonce != null));
    }
};
qr.scan();
App.connectToPair(screen, mapper, ".", assocListener, pairId+":"+pairNonce);
