enum PolylineMode {
  OUTLINE, 
    FILL, 
    FILL_ONLY,
}

class PolyLine implements Drawable {
  PVector[] points;
  boolean closed;
  PolylineMode mode;
  color strokeColor;
  color fillColor;
  PVector[] filledPoints;
  PVector[] borderPoints;
  PVector[] intersects;


  PolyLine(PVector[] points, PolylineMode mode, boolean closed, color strokeColor, color fillColor) {
    this.points = points;
    this.closed = closed;
    this.mode = mode;
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;
    filledPoints = new PVector[0];
    borderPoints = new PVector[0];
    intersects = new PVector[0];
  }
  PolyLine(PVector[] points, PolylineMode mode, boolean closed, color strokeColor) {
    this(points, mode, closed, strokeColor, strokeColor);
  }
  PolyLine(PVector[] points, PolylineMode mode, boolean closed) {
    this(points, mode, closed, #FFFFFF);
  }
  PolyLine(PVector[] points, PolylineMode mode) {
    this(points, mode, true);
  }
  PolyLine(PVector[] points) {
    this(points, PolylineMode.OUTLINE);
  }

  PVector[] draw(Grid grid) {
    if (points.length == 0) return borderPoints;
    drawOutline(grid);
    drawFill(grid);
    return borderPoints;
  }

  void drawOutline(Grid grid) {
    if (mode == PolylineMode.FILL_ONLY) return;
    for (int i = 0; i < points.length - 1; i++) {
      borderPoints = (PVector[]) concat(borderPoints, new Line(points[i], points[i+1], strokeColor).draw(grid));
    }
    if (points.length > 0 && closed) {
      borderPoints = (PVector[]) concat(borderPoints, new Line(points[points.length - 1], points[0], strokeColor).draw(grid));
    }
  }

  void drawFill(Grid grid) {
    if (mode == PolylineMode.OUTLINE) return;
    if (!closed || points.length < 3) return;

    for (int i=0; i < fillStep; i++) {
      PVector p = new PVector(-1, (float)i +0.5);
      for (int j=0; j < points.length; j++) {
        PVector intersect = getInter(p, j, j == points.length - 1 ? 0 : j+1);
        if (intersect == null || inPoints(intersect)) continue;
        intersects = (PVector[]) append(intersects, intersect);
      }
    }
    bubbleSortIntersects();
    printArray(intersects);
    for (int i=0; i < intersects.length - 1; i += 2) {
      if (i >= intersects.length) continue;
      PVector from = intersects[i];
      PVector to = intersects[i+1];

      if (from.y != to.y) continue;
      for (int j = floor(from.x + 1); j < to.x; j++) {
        PVector p = new PVector((int)j, (int)from.y);
        if(pointIsOnBorder(p)) continue;
        grid.draw(p, fillColor);
        filledPoints = (PVector[]) append(filledPoints, p);
      }
    }
  }

  PVector getInter(PVector p, int from, int to) {
    PVector start = points[from];
    PVector end = points[to];
    PVector extreme = new PVector(33, p.y);

    if (orientation(p, start, end) == 0) return null;
    PVector intersect = getIntersection(start, end, p, extreme);
    if (intersect == null || inPoints(intersect)) 
      return null;
    else {
      return intersect;
    }
  }

  boolean inPoints(PVector p) {
    for (int j=0; j < points.length; j++) {
      if (p.equals(points[j])) return true;
    }
    return false;
  }

  boolean pointIsOnBorder(PVector p) {
    for (int i = 0; i < borderPoints.length - 1; i++) {
      if ((int)borderPoints[i].x == (int)p.x && (int)borderPoints[i].y == (int)p.y) 
        return true;
    }
    return false;
  }

  void bubbleSortIntersects() {  
    PVector temp = null;  
    for (int i=0; i < intersects.length; i++) {  
      for (int j=1; j < (intersects.length-i); j++) {  
        if (intersects[j-1].y == intersects[j].y && intersects[j-1].x > intersects[j].x) {  
          //swap elements  
          temp = intersects[j-1];  
          intersects[j-1] = intersects[j];  
          intersects[j] = temp;
        }
      }
    }
  }
}
