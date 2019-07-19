class Attractor implements CircleEntity {
  protected CirclePosition position;
  protected String uuid;

  public Attractor(float x, float y) {
    this(UUIDGenerator.next(), x, y, 40);
  }
  
  public Attractor(float x, float y, float radius) {
    this(UUIDGenerator.next(), x, y, radius);
  }
  
  public Attractor(String uuid, float x, float y, float radius) {
    this.uuid = uuid;
    this.position = new CirclePosition(x, y, radius);
  }

  @Override String getUUID() {
    return this.uuid;
  }

  @Override
  CirclePosition getPosition() {
    return this.position;
  }

  @Override
  void update(float deltaTime) {}

  @Override
  void draw() {
    fill(255, 255, 0);
    ellipse(this.position.x, this.position.y, this.position.radius, this.position.radius);

    fill(255, 0, 0);
    ellipse(this.position.x, this.position.y, this.position.radius / 10, this.position.radius / 10);
    
    fill(0, 0, 255);
    float textW = textWidth(this.getUUID());
    text(this.getUUID(), this.position.x - textW / 2, this.position.y + 5);
  }
}
