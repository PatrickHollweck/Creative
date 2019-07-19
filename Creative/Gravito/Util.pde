static class Util {
  public static void swap(ArrayList<Object> coll, int a, int b) {
    Object aItem = coll.get(a);
    Object bItem = coll.get(b);
    coll.set(a, bItem);
    coll.set(b, aItem);
  }

  public static boolean isClass(Object o, Class c) {
    return o.getClass() == c;
  }
  
  public static boolean isInsideOf(PointPosition pos, float width, float height) {
    return pos.x < width && pos.x > 0 && pos.y > 0 && pos.y < height;
  }
}

class DragMovment {
  public PointPosition start;
  public PointPosition end;
  
  public float distance() {
    return CMath.distance(this.start, this.end);
  }
  
  public PVector vectorize() {
    PVector a = new PVector(this.start.x, this.start.y);
    PVector b = new PVector(this.end.x, this.end.y);
    
    return b.sub(a).mult(0.05);
  }
}
