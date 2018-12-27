int gridSize = 32;
float offset = 40;
boolean drawingEnabled = true;
boolean gridLoggingEnabled = true;
boolean printFilledPoints = false;
color drawColor = #FFFFFF;
boolean fillFigures = false;
int fillStep = 1;
Grid grid;

PVector[] points1 = new PVector[]{
  new PVector(4, 4), //top
  new PVector(4, 26), //bot
  new PVector(20, 26), //bot
  new PVector(28, 18), // right
  new PVector(21, 4), // right
  new PVector(21, 8), // top
  new PVector(10, 8), // top
  new PVector(10, 4), // top
};
PolyLine poly1 = new PolyLine(points1, PolylineMode.FILL,true, #00FF00, #FF0000);
PVector[] points2 = new PVector[]{
  new PVector(10, 12), //top
  new PVector(10, 20), //bot
  new PVector(17, 20), //bot
  new PVector(21, 16), //right
  new PVector(21, 12), //top
};
PolyLine poly2 = new PolyLine(points2, PolylineMode.FILL, true, #00FFFF, #0000FF);
