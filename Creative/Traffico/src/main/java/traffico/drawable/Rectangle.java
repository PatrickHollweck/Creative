package traffico.drawable;

import processing.core.PApplet;
import traffico.drawable.layout.RectanglePosition;

public class Rectangle extends Drawable {
	private RectanglePosition position;
	
	public Rectangle(RectanglePosition position) {
		this.position = position;
	}

	@Override
	public void draw(PApplet gl) {
		gl.rect(
			this.position.getBottomLeft().getX(),
			this.position.getBottomLeft().getY(),
			this.position.getWidth(),
			this.position.getHeight()
		);
	}

	public RectanglePosition getPosition() {
		return position;
	}

	public void setPosition(RectanglePosition position) {
		this.position = position;
	}
}
