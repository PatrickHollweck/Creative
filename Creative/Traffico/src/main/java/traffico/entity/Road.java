package traffico.entity;

import processing.core.PApplet;
import traffico.drawable.Drawable;
import traffico.drawable.Rectangle;
import traffico.drawable.layout.RectanglePosition;

public class Road extends Drawable {
	private RectanglePosition position;
	
	public Road(RectanglePosition position) {
		this.position = position;
	}

	@Override
	public void draw(PApplet gl) {
		gl.color(100);
		new Rectangle(position).draw(gl);
	}
	
	public RectanglePosition getPosition() {
		return position;
	}

	public void setPosition(RectanglePosition position) {
		this.position = position;
	}
}
