ArrayList<Entity> entities = new ArrayList<Entity>();

Entity preview;
DragMovment drag;

long lastUpdateTime;

void setup() {
  surface.setTitle("Gravito");
  size(800, 600);

  drag = new DragMovment();
  ellipseMode(RADIUS);
}

void mousePressed() {
  drag.start = new PointPosition(mouseX, mouseY);
}

void mouseDragged() {
  drag.end = new PointPosition(mouseX, mouseY);
  
  if(mouseButton == LEFT) {
    stroke(255);
    preview = new LineEntity(
      "Drag to set velocity",
      new PointPosition(drag.start.x, drag.start.y),
      new PointPosition(drag.end.x, drag.end.y)
    ); //<>//
  } else {
    float size = drag.distance() >= 50 ? (float)Math.floor(drag.distance()) : 50;
    preview = new Attractor("Preview", mouseX, mouseY, size);
  }

  drag.end = null;
}

void mouseReleased() { 
  drag.end = new PointPosition(mouseX, mouseY);

  if (mouseButton == LEFT) {
    entities.add(
      new Mover(mouseX, mouseY, drag.vectorize())
    );
  } else {
    int size = drag.distance() >= 50 ? (int)Math.floor(drag.distance()) : 50;

    entities.add(
      new Attractor(mouseX, mouseY, size)
    );
  }
  
  preview = null;
}

void draw() {
  float deltaTime = (float)((-lastUpdateTime + (lastUpdateTime = frameRateLastNanos)) / 1e6d);
  surface.setTitle("Gravito - FPS: " + Math.floor(frameRate) + " - EntityCount: " + entities.size());
  
  background(0);

  ArrayList<Entity> attractors = new ArrayList<Entity>();
  ArrayList<Entity> movers = new ArrayList<Entity>();

  for (int i = 0; i < entities.size(); i++) {
    Entity current = entities.get(i);

    if(Util.isClass(current, Attractor.class)) {
      attractors.add(current);
    } else if(Util.isClass(current, Mover.class)) {
      movers.add(current);
    }
  }

  entities.clear();
  entities = new ArrayList<Entity>();
  entities.addAll(attractors);
  entities.addAll(movers);

  for (int i = 0; i < entities.size(); i++) {
    Entity current = entities.get(i);
    current.update(deltaTime);
    current.draw();
  }

  if(preview != null) {
    preview.draw();
  }
}
