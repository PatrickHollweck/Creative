package com.patrickhollweck.UPS.game.layout;

public class RectanglePosition {
	private Position topLeft;
	private Position bottomRight;

	public RectanglePosition(Position topLeft, Position bottomRight) {
		this.topLeft = topLeft;
		this.bottomRight = bottomRight;
	}

	public RectanglePosition(int xTopLeft, int yTopLeft, int xBottomRight, int yBottomRight) {
		bottomRight = new Position(xBottomRight, yBottomRight);
		topLeft = new Position(xTopLeft, yTopLeft);
	}

	public Position getTopLeft() {
		return topLeft;
	}

	public Position getBottomRight() {
		return bottomRight;
	}

	public Position getTopRight() {
		return new Position(getTopLeft().getX() + getWidth(), getTopLeft().getY());
	}

	public Position getBottomLeft() {
		return new Position(getBottomRight().getX() - getWidth(), getBottomRight().getY());
	}

	public float getHeight() {
		return this.topLeft.getY() - this.bottomRight.getY();
	}

	public float getWidth() {
		return this.bottomRight.getX() - this.getTopLeft().getX();
	}
}