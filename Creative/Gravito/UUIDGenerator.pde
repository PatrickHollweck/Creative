public static class UUIDGenerator {
  protected static int counter = 0;

  public static String next() {
    return Integer.toString(++counter);
  }
}
