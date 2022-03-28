//vj synth to be controlled from wekinator
//expects two osc inputs, speed and numLines, each between 0 and 1

import oscP5.*;
import netP5.*;
OscP5 oscP5;
NetAddress dest;

float t = 0;
float numLines = 1;
float speed = 0.5;

color from = color(0, 255, 100);
color to = color(255, 0, 0);

float x0(float t) {
  return (cos(t/200))*20;
}
float y0(float t) {
  return sin(t/40) * 100;
}
float x1(float t) {
  return cos(t/100)*120;
}
float y1(float t) {
  return sin(t/40) * 200;
}

void setup() {
  //Initialize OSC communication
  oscP5 = new OscP5(this, 12000); //listen for OSC messages on port 12000 (Wekinator default)
  dest = new NetAddress("127.0.0.1", 6448); //send messages back to Wekinator on port 6448, localhost (this machine) (default)

  // initialize the drawing window
  size( 512, 512, P3D );
  background(0);
}

void draw() {
  background(0);
  translate(width/2, height/2);
  stroke(255);
  strokeWeight(1);

  for (int i = 0; i < map(numLines, 0, 1, 1, 100); i++) {
    //stroke(lerpColor(from, to, (1+sin(i))/2));
    line(x0(t+i), y0(t+i), x1(t+i), y1(t+i));
  }
  t = t + map(speed, 0, 1, 0.01, 1);
}

//This is called automatically when OSC message is received
void oscEvent(OscMessage theOscMessage) {
  if (theOscMessage.checkAddrPattern("/wek/outputs")==true) {
    if (theOscMessage.checkTypetag("ff")) {
      speed= theOscMessage.get(0).floatValue();
      numLines = theOscMessage.get(1).floatValue();
    }
  }
}
