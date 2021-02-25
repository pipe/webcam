#include <gst/gst.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

/* Structure to contain all our information, so we can pass it to callbacks */
/*
 *
echo "sending to " ${1}
exec gst-launch-1.0 \
 rpicamsrc keyframe-interval=30 bitrate=768000 ! video/x-h264,width=640,height=480,framerate=15/1! h264parse !\
 rtph264pay config-interval=1 mtu=1208 ! "application/x-rtp, payload=(int)96, ssrc=(uint)555555" !\
 udpsink host=127.0.0.1 port=${1}

v4l2src device=/dev/video0 ! video/x-raw,framerate=30/1,width=640,height=480,format=YUY2 ! videoconvert ! x264enc 
tune=zerolatency bitrate=4000 speed-preset=ultrafast aud=False key-int-max=5 threads=4 
! video/x-h264,profile=baseline ! h264parse ! rtph264pay config-interval=1 mtu=1208 ! "application/x-rtp, payload=(int)96, ssrc=(uint)555555" !  udpsink host=127.0.0.1 port=${1} 
 */
typedef struct _CustomData {
  GstElement *pipeline;
  GstElement *source;
  GstCaps    *cam;
#ifndef RPICAMSRC
  GstElement *convert;
  GstElement *encode;
  GstCaps    *h264;
#endif
  GstElement *parse;
  GstElement *payload;
  GstCaps    *rtp;
  GstElement *sink;
  GMainLoop *loop;

} CustomData;

static gboolean handle_keyboard (GIOChannel *source, GIOCondition cond, CustomData *data) {
  gchar *str = NULL;

  g_printerr("bwe");

  if (g_io_channel_read_line (source, &str, NULL, NULL, NULL) != G_IO_STATUS_NORMAL) {
    return TRUE;
  }
  gint bw = atoi(str);
  fprintf(stderr,"bwe is %d\n",bw);
#ifdef RPICAMSRC
  bw *=1000;
  g_object_set (data->source, "bitrate", bw, NULL);
#else
  g_object_set (data->encode, "bitrate", bw, NULL);
#endif
   
  g_free (str);

  return TRUE;
}


static gboolean
link_with_caps_filter (GstElement *element1, GstCaps *caps , GstElement *element2)
{
  gboolean link_ok;

  link_ok = gst_element_link_filtered (element1, element2, caps);
  //link_ok = gst_element_link (element1, element2);
  if (!link_ok) {
	  g_warning ("Failed to link "); 
	  g_warning (GST_ELEMENT_NAME(element1)); 
	  g_warning ("and "); 
	  g_warning (GST_ELEMENT_NAME(element2)); 
  }
  return link_ok;
}

/* Handler for the pad-added signal */
static void pad_added_handler (GstElement *src, GstPad *pad, CustomData *data);

int main(int argc, char *argv[]) {
  GIOChannel *io_stdin;
  CustomData data;
  GstBus *bus;
  GstMessage *msg;
  GstStateChangeReturn ret;
  gboolean terminate = FALSE;
  gboolean linked = FALSE;
  gint port = 47806;
  /* Initialize GStreamer */
  gst_init (NULL,NULL);

  if (argc == 2){
    if (argv[1] != NULL){
      port = atoi(argv[1]);
    }
  }

  /* Create the elements */
 
#ifdef RPICAMSRC
  data.source = gst_element_factory_make ("rpicamsrc", "source");
#else
  data.source = gst_element_factory_make ("v4l2src", "source");
  data.convert = gst_element_factory_make ("videoconvert", "convert");
  data.encode = gst_element_factory_make ("x264enc", "encode");
#endif
  data.parse = gst_element_factory_make ("h264parse", "parse");
  data.payload = gst_element_factory_make ("rtph264pay", "payload");
  data.sink = gst_element_factory_make ("udpsink", "sink");

#ifdef RPICAMSRC
  g_object_set(data.source, "keyframe-interval",30, "preview",0,"annotation-mode",1,"annotation-text","|pipe|", "bitrate",768000, NULL);
#else
  g_object_set(data.source, "device", "/dev/video0", NULL);
  g_object_set(data.encode, "tune",4,"bitrate",1000,"speed-preset",1,"aud",FALSE,"key-int-max",5,"threads",4,NULL);
#endif
  g_object_set(data.payload, "config-interval",1,"mtu",1208,NULL);
  g_object_set(data.sink, "host","127.0.0.1","port",port,NULL);
  /* Create the empty pipeline */
  data.pipeline = gst_pipeline_new ("videorelay-pipeline");

  if (!data.pipeline || !data.source 
#ifndef RPICAMSRC
    || !data.convert || !data.encode 
#endif 
    || !data.parse || !data.payload || !data.sink) {
    g_printerr ("Not all elements could be created.\n");
    return -1;
  }
#ifdef RPICAMSRC
  data.cam = gst_caps_new_simple ("video/x-h264", "width", G_TYPE_INT, 640, "height", G_TYPE_INT, 480, "framerate", GST_TYPE_FRACTION, 30, 1, NULL);
#else
  data.cam = gst_caps_new_simple ("video/x-raw", "format", G_TYPE_STRING, "YUY2", "width", G_TYPE_INT, 640, "height", G_TYPE_INT, 480, "framerate", GST_TYPE_FRACTION, 30, 1, NULL);
  data.h264 = gst_caps_new_simple ("video/x-h264", "profile",G_TYPE_STRING,"baseline", NULL);
#endif
  data.rtp = gst_caps_new_simple ("application/x-rtp", "payload",G_TYPE_INT,96,"ssrc",G_TYPE_UINT,555555, NULL);

  /* Build the pipeline. Note that we are NOT linking the source at this
   * point. We will do it later. */
#ifdef RPICAMSRC
  gst_bin_add_many (GST_BIN (data.pipeline), data.source, data.parse, data.payload, data.sink, NULL);
   if(link_with_caps_filter (data.source, data.cam, data.parse)){
      if(gst_element_link (data.parse, data.payload)){
        if (link_with_caps_filter(data.payload,data.rtp,data.sink)){
	  linked = TRUE;	
	}
      }
   }
#else 
  gst_bin_add_many (GST_BIN (data.pipeline), data.source, data.convert , data.encode, data.parse, data.payload, data.sink, NULL);
  if (link_with_caps_filter(data.source,data.cam,data.convert)){
   if(gst_element_link (data.convert, data.encode)){
    if (link_with_caps_filter(data.encode,data.h264,data.parse)){
      if(gst_element_link (data.parse, data.payload)){
        if (link_with_caps_filter(data.payload,data.rtp,data.sink)){
	  linked = TRUE;	
	}
      }
    }
   }
  }
#endif
  if(!linked){
    g_printerr ("Not all elements could be linked.\n");
    return -1;
  } else { 
    g_printerr ("all elements could be linked.\n");
  }

  /* Connect to the pad-added signal */
  g_signal_connect (data.source, "pad-added", G_CALLBACK (pad_added_handler), &data);

  /* Start playing */
  ret = gst_element_set_state (data.pipeline, GST_STATE_PLAYING);
  if (ret == GST_STATE_CHANGE_FAILURE) {
    g_printerr ("Unable to set the pipeline to the playing state.\n");
    gst_object_unref (data.pipeline);
    return -1;
  } else {
    g_printerr ("set the pipeline to the playing state.\n");
  }

    /* Add a keyboard watch so we get notified of keystrokes */
  //io_stdin =  g_io_channel_new_file ("bwe", "r", GError **error);
#ifdef G_OS_WIN32
  io_stdin = g_io_channel_win32_new_fd (fileno (stdin));
#else
  io_stdin = g_io_channel_unix_new (fileno (stdin));
#endif
  g_io_add_watch (io_stdin, G_IO_IN, (GIOFunc)handle_keyboard, &data);

  data.loop = g_main_loop_new (NULL, FALSE);
  g_main_loop_run (data.loop);
  /* Free resources */
  gst_object_unref (bus);
  gst_element_set_state (data.pipeline, GST_STATE_NULL);
  gst_object_unref (data.pipeline);
  return 0;
}

/* This function will be called by the pad-added signal */
static void pad_added_handler (GstElement *src, GstPad *new_pad, CustomData *data) {
  GstPadLinkReturn ret;
  GstCaps *new_pad_caps = NULL;
  GstStructure *new_pad_struct = NULL;
  const gchar *new_pad_type = NULL;

  g_printerr ("Received new pad '%s' from '%s':\n", GST_PAD_NAME (new_pad), GST_ELEMENT_NAME (src));

  /* Check the new pad's type */
  new_pad_caps = gst_pad_get_current_caps (new_pad);
  new_pad_struct = gst_caps_get_structure (new_pad_caps, 0);
  new_pad_type = gst_structure_get_name (new_pad_struct);
  g_printerr ("It has type '%s' which is not raw video. Ignoring.\n", new_pad_type);

}
