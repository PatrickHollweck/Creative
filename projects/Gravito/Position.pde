class PointPosition extends PVector {
  public PointPosition(float x, float y) {
    super(x, y);
  }
}

class CirclePosition extends PointPosition {
  public float radius;

  public CirclePosition(float x, float y, float radius) {
    super(x, y);
    this.radius = radius;
  }
}
