class Line implements Drawable {
  PVector start;
  PVector end;
  color colour;

  Line(int x0, int y0, int x1, int y1, color c) {
    this(new PVector(x0, y0), new PVector(x1, y1), c);
  }
  Line(int x0, int y0, int x1, int y1) {
    this(x0, y0, x1, y1, #FFFFFF);
  }
  Line(PVector start, PVector end) {
    this(start, end, #FFFFFF);
  }
  Line(PVector start, PVector end, color c) {
    this.start = start;
    this.end = end;
    colour = c;
  }

  PVector[] draw(Grid grid) {
    PVector[] p;
    if (abs(end.y - start.y) < abs(end.x - start.x)) {
      if (start.x > end.x)
        p = drawSlopeLow(grid, (int)end.x, (int)end.y, (int)start.x, (int)start.y);
      else
        p = drawSlopeLow(grid, (int)start.x, (int)start.y, (int)end.x, (int)end.y);
    } else {
      if (start.y > end.y)
        p = drawSlopeHigh(grid, (int)end.x, (int)end.y, (int)start.x, (int)start.y);
      else
        p = drawSlopeHigh(grid, (int)start.x, (int)start.y, (int)end.x, (int)end.y);
    }
    return p;
  }

  PVector[] drawSlopeLow(Grid grid, int startX, int startY, int endX, int endY) {
    PVector[] p = new PVector[0];
    int dx = endX - startX;
    int dy = endY - startY;
    int yi = 1;
    if (dy < 0) {
      yi = -1;
      dy = -dy;
    }
    int D = 2*dy - dx;
    int y = startY;

    for (int x = startX; x <= endX; x++) {
            p = (PVector[]) append(p, new PVector(x, y));
grid.draw(x, y, colour);
      if (D > 0) {
        y = y + yi;
        D = D - 2*dx;
      }
      D = D + 2*dy;
    }
    return p;
  }

  PVector[] drawSlopeHigh(Grid grid, int startX, int startY, int endX, int endY) {
    PVector[] p = new PVector[0];
    int dx = endX - startX;
    int dy = endY - startY;
    int xi = 1;
    if (dx < 0) {
      xi = -1;
      dx = -dx;
    }
    int D = 2*dx - dy;
    int x = startX;

    for (int y = startY; y <= endY; y++) {

      p = (PVector[]) append(p, new PVector(x, y));
      grid.draw(x, y, colour);
      if (D > 0) {
        x = x + xi;
        D = D - 2*dy;
      }
      D = D + 2*dx;
    }
    return p;
  }
}
