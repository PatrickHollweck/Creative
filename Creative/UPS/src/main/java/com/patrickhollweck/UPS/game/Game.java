package com.patrickhollweck.UPS.game;

public class Game implements Drawable {

	@Override
	public void draw(RenderContext context) {
		context.gl.ellipse(context.gl.mouseX, context.gl.mouseY, 10, 10);
	}

}