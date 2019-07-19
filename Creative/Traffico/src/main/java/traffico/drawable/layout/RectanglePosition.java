package traffico.drawable.layout;

public class RectanglePosition {
	private Point bottomLeft;
	private Point topRight;
	
	public RectanglePosition(Point bottomLeft, Point topRight) {
		this.bottomLeft = bottomLeft;
		this.topRight = topRight;
	}

	public Point getBottomLeft() {
		return bottomLeft;
	}

	public void setBottomLeft(Point bottomLeft) {
		this.bottomLeft = bottomLeft;
	}

	public Point getTopRight() {
		return topRight;
	}

	public void setTopRight(Point topRight) {
		this.topRight = topRight;
	}
	
	public int getWidth() {
		return this.topRight.getY() - this.bottomLeft.getY();
	}
	
	public int getHeight() {
		return this.topRight.getX() - this.bottomLeft.getX();
	}
}
