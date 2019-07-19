public static class Colliders {
  public static boolean circleWithCircle(CirclePosition a, CirclePosition b) {
    return Math.hypot(a.x - b.x, a.y - b.y) <= (a.radius + b.radius);
  }
}
