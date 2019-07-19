class Mover implements CircleEntity, Movable {
  protected CirclePosition position;
  protected PVector velocity;
  protected String uuid;

  public Mover(String uuid, float x, float y, PVector velocity) {
    this.uuid = uuid;
    this.position = new CirclePosition(x, y, 10);
    this.velocity = velocity;
  }
  
  public Mover(float x, float y, PVector velocity) {
    this(UUIDGenerator.next(), x, y, velocity);
  }
  
  public Mover(float x, float y) {
    this(x, y, new PVector(1, 0));
  }

  @Override
  String getUUID() {
    return this.uuid;
  }
  
  @Override
  PVector getVelocity() {
    return this.velocity;
  }
  
  @Override
  void setVelocity(PVector vec) {
    this.velocity = vec;
  }

  @Override
  CirclePosition getPosition() {
    return this.position;
  }

  @Override
  void update(float deltaTime) {
    if (!Util.isInsideOf(this.getPosition(), width, height)) {
      entities.remove(this);
    }

    for(int i = 0; i < entities.size(); i++) {
      Entity current = entities.get(i);

      if(current == this) {
        continue;
      }

      if(current instanceof CircleEntity) {
        CircleEntity other = (CircleEntity)current;

        if(Colliders.circleWithCircle(other.getPosition(), this.getPosition())) {
          println(this.getUUID() + " smashed " + other.getUUID());
          
          if(Util.isClass(other, Mover.class)) {
            Mover otherMover = (Mover)other;
            
            PVector original = otherMover.getVelocity().copy();
            
            otherMover.setVelocity(this.getVelocity().rotate(180));
            this.setVelocity(original.rotate(180));
          } else if(Util.isClass(other, Attractor.class)) {
            
          }

          //float distance = CMath.distance(this.getPosition(), other.getPosition());
          //PVector scaler = PVector.mult(other.getPosition(), map(distance, 0, other.getPosition().radius, 0.01, 0));
          //this.velocity.add(scaler);
        }
      }
    }
    
    this.position.add(PVector.mult(this.velocity, 0.06 * deltaTime));
  }
  
  @Override
  void draw() {
    fill(255, 255, 255);
    ellipse(this.position.x, this.position.y, this.position.radius, this.position.radius);
    
    fill(0, 0, 255);
    text(this.getUUID(), this.position.x - textWidth(this.getUUID()) / 2, this.position.y + 5);
  }
}
