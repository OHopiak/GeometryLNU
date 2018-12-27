class Grid {
  public boolean[][] draw;
  color[][] colors;

  Grid(int l, int w) {
    draw = new boolean[l][w];
    colors = new color[l][w];
    for (int i = 0; i < l; i++) {
      for (int j = 0; j < w; j++) {
        draw[i][j] = false;
        colors[i][j] = #FFFFFF;
      }
    }
  }

  void render(float x0, float y0, float x1, float y1) {
    render(x0, y0, x1, y1, 5);
  }

  void render(float x0, float y0, float x1, float y1, float offset) {
    float blockSizeX = (x1-x0 - offset) / draw[0].length;
    float blockSizeY = (y1-y0 - offset) / draw.length;

    for (int i = 0; i < draw.length; i++) {
      for (int j = 0; j < draw[0].length; j++) {
        if (draw[i][j]) {
          stroke(colors[i][j]);
          fill(colors[i][j]);
          rect(
            x0 + j * blockSizeX + offset, y0 + i * blockSizeY + offset, 
            blockSizeX - offset, blockSizeY - offset
            );
        }
      }
    }

    stroke(255);
    strokeWeight(3);
    line(x0, y0, x0, y1);
    line(x0, y0, x1, y0);
    line(x1, y0, x1, y1);
    line(x0, y1, x1, y1);
  }

  void draw(int x, int y, color colour) {
    if (y < 0 || y >= draw.length || x < 0 || x >= draw[0].length) return;
    draw[y][x] = true;
    colors[y][x] = colour;
  }

  void draw(int x, int y) {
    draw(x, y, #FFFFFF);
  }

  void draw(float x, float y) {
    draw(x, y, #FFFFFF);
  }

  void draw(PVector pos) {
    draw(pos, #FFFFFF);
  }

  void draw(float x, float y, color colour) {
    draw((int)x, (int)y, colour);
  }

  void draw(PVector pos, color colour) {
    draw((int)pos.x, (int)pos.y, colour);
  }


  void erase(int x, int y) {
    if (y < 0 || y >= draw.length || x < 0 || x >= draw[0].length) return;
    draw[y][x] = false;
  }

  void draw(Drawable d) {
    d.draw(this);
  }
}

interface Drawable {
  abstract PVector[] draw(Grid grid);
}
