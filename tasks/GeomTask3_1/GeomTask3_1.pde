void setup() {
  size(800, 800);
  grid = new Grid(gridSize, gridSize);
  grid.draw(poly1);
  grid.draw(poly2);
  if (printFilledPoints) {
    printArray(poly1.filledPoints);
    printArray(poly2.filledPoints);
  }
}

void draw() {
  float size = min(width, height);
  background(0);
  grid.render(offset, offset, size - offset, size - offset);
}

void keyPressed(){
  fillStep++;
  println(fillStep);
}

void mouseClicked() {
  float size = min(width, height);
  if (mouseX > offset && mouseX < size-offset && mouseY > offset && mouseY < size-offset) {
    float blockSize = round((size-2*offset)/(float)gridSize);
    int x = floor((mouseX - offset + 3) / blockSize);
    int y = floor((mouseY - offset + 3) / blockSize);
    if (gridLoggingEnabled) {
      print("(");
      print(x);
      print(",");
      print(y);
      println(")");
    }
    if (drawingEnabled) {
      if (mouseButton == LEFT) {
        grid.draw(x, y, drawColor);
      } else if (mouseButton == RIGHT) {
        grid.erase(x, y);
      }
    }
  }
}
