interface HasUUID {
  String getUUID();
}

interface Entity extends HasUUID {
  void draw();
  void update(float deltaTime);
}

interface CircleRender {
  CirclePosition getPosition();
}

interface Movable {
  PVector getVelocity();
  void setVelocity(PVector vec);
}

interface CircleEntity extends Entity, CircleRender { }

class LineEntity implements Entity {
  protected String uuid;
  protected PointPosition start;
  protected PointPosition end;
  
  public LineEntity(String uuid, PointPosition start, PointPosition end) {
    this.uuid = uuid;
    this.start = start;
    this.end = end;
  }
  
  @Override
  void update(float deltaTime) { }
  
  @Override
  void draw() {
    fill(255, 255, 255);
    text(this.getUUID(), this.start.x + 5, this.start.y + 5);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
  
  @Override
  String getUUID() { 
    return this.uuid;
  }
}
