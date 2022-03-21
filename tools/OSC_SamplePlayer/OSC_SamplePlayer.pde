import processing.sound.*;
import oscP5.*;
import netP5.*;

OscP5 oscP5;
SoundFile kick;
float lastDetectedClass = -1;

void setup() {
  size(640, 360);
  background(255);


  oscP5 = new OscP5(this, 12000);


  // Load a soundfile from the /data folder of the sketch and play it back
  kick = new SoundFile(this, "kick.wav");
  kick.play();
}

void draw() {
}

void oscEvent(OscMessage msg) {
  String address = msg.addrPattern();

  if (address.equals("/kick")) {
    println("trigger kick");
    kick.play();
  }

  if (msg.checkAddrPattern("/wek/outputs")) {
    //println("got message "+msg.addrPattern());
    if (msg.checkTypetag("f")) {
      float detectedClass = msg.get(0).floatValue();
      // if nothing has changed then return function
      if (detectedClass == lastDetectedClass) {
        return;
      }
      if (detectedClass == 1) {
        kick.play();
      }
      if (detectedClass == 2) {
        //snare.play();
      }
      println("last detected class: "+lastDetectedClass);
      println("detected class: "+detectedClass);
      lastDetectedClass = detectedClass;
      return;
    }
  }
}
