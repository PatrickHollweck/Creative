public static class CMath {
  public static float distance(CirclePosition a, CirclePosition b) {
    // TODO: Fix
    return dist(a.x, a.y, b.x, b.y);
  }
  
  public static float distance(PointPosition a, PointPosition b) {
    return dist(a.x, a.y, b.x, b.y);
  }
}
