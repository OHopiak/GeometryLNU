
// Given three colinear points p, q, r, the function checks if 
// point q lies on line segment 'pr' 
boolean onSegment(PVector p, PVector q, PVector r) 
{ 
  if (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) && 
    q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y)) 
    return true; 
  return false;
}

// To find orientation of ordered triplet (p, q, r). 
// The function returns following values 
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
int orientation(PVector p, PVector q, PVector r) 
{ 
  int val = (int) ((q.y - p.y) * (r.x - q.x) - 
    (q.x - p.x) * (r.y - q.y)); 

  if (val == 0) return 0;  // colinear 
  return (val > 0)? 1: 2; // clock or counterclock wise
}

// The function that returns true if line segment 'p1q1' 
// and 'p2q2' intersect. 
boolean doIntersect(PVector p1, PVector q1, PVector p2, PVector q2) 
{ 
  // Find the four orientations needed for general and 
  // special cases 
  int o1 = orientation(p1, q1, p2); 
  int o2 = orientation(p1, q1, q2); 
  int o3 = orientation(p2, q2, p1); 
  int o4 = orientation(p2, q2, q1); 

  // General case 
  if (o1 != o2 && o3 != o4) 
    return true; 

  // Special Cases 
  // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
  if (o1 == 0 && onSegment(p1, p2, q1)) return true; 

  // p1, q1 and p2 are colinear and q2 lies on segment p1q1 
  if (o2 == 0 && onSegment(p1, q2, q1)) return true; 

  //// p2, q2 and p1 are colinear and p1 lies on segment p2q2 
  //if (o3 == 0 && onSegment(p2, p1, q2)) return true; 

  //// p2, q2 and q1 are colinear and q1 lies on segment p2q2 
  //if (o4 == 0 && onSegment(p2, q1, q2)) return true; 

  return false; // Doesn't fall in any of the above cases
}

PVector getIntersection(PVector p1, PVector q1, PVector p2, PVector q2) {
  if (q1.x - p1.x != 0 && q2.x - p2.x != 0)
    return getIntersectionX(p1, q1, p2, q2);
  else if (q1.y - p1.y != 0 && q2.y - p2.y != 0)
    return getIntersectionX(p1, q1, p2, q2);
  else
    return getIntersectionZero(p1, q1, p2, q2);
}

PVector getIntersectionX(PVector p1, PVector q1, PVector p2, PVector q2) {
  float k1 = (q1.y - p1.y)/(q1.x - p1.x);
  float k2 = (q2.y - p2.y)/(q2.x - p2.x);
  float b1 = p1.y - p1.x * k1;
  float b2 = p2.y - p2.x * k2;
  float x = (b2 - b1)/(k1 - k2);
  float y = k1 * x + b1;
  PVector p = new PVector(x, y);
  boolean exists1 = p.x >= min(p1.x, q1.x) && p.x <= max(p1.x, q1.x) && p.y >= min(p1.y, q1.y) && p.y <= max(p1.y, q1.y);
  boolean exists2 = p.x >= min(p2.x, q2.x) && p.x <= max(p2.x, q2.x) && p.y >= min(p2.y, q2.y) && p.y <= max(p2.y, q2.y);
  return exists1 && exists2 ? p : null;
}

PVector getIntersectionY(PVector p1, PVector q1, PVector p2, PVector q2) {
  float k1 = (q1.x - p1.x)/(q1.y - p1.y);
  float k2 = (q2.x - p2.x)/(q2.y - p2.y);
  float b1 = p1.x - p1.y * k1;
  float b2 = p2.x - p2.y * k2;
  float y = (b2 - b1)/(k1 - k2);
  float x = k1 * y + b1;
  //println(">>getIntersectionY");
  //print(">>");
  //println(k1);
  //print(">>");
  //println(k2);
  //print(">>");
  //println(b1);
  //print(">>");
  //println(b2);
  //print(">>");
  //println(x);
  //print(">>");
  //println(y);

  PVector p = new PVector(x, y);
  boolean exists1 = p.x >= min(p1.x, q1.x) && p.x <= max(p1.x, q1.x) && p.y >= min(p1.y, q1.y) && p.y <= max(p1.y, q1.y);
  boolean exists2 = p.x >= min(p2.x, q2.x) && p.x <= max(p2.x, q2.x) && p.y >= min(p2.y, q2.y) && p.y <= max(p2.y, q2.y);
  return exists1 && exists2 ? p : null;
}

PVector getIntersectionZero(PVector p1, PVector q1, PVector p2, PVector q2) {
  PVector p = p1.x - q1.x == 0 ? new PVector(p1.x, p2.y) : new PVector(p2.x, p1.y);
  boolean exists1 = p.x >= min(p1.x, q1.x) && p.x <= max(p1.x, q1.x) && p.y >= min(p1.y, q1.y) && p.y <= max(p1.y, q1.y);
  boolean exists2 = p.x >= min(p2.x, q2.x) && p.x <= max(p2.x, q2.x) && p.y >= min(p2.y, q2.y) && p.y <= max(p2.y, q2.y);
  //println(">>getIntersectionZero");
  //print(">>");
  //println(p);

  return exists1 && exists2 ? p : null;
}
