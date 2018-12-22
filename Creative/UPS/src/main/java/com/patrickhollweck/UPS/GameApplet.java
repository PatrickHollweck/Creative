package com.patrickhollweck.UPS;

import com.patrickhollweck.UPS.game.Drawable;
import com.patrickhollweck.UPS.game.Game;
import com.patrickhollweck.UPS.game.RenderContext;

import processing.core.PApplet;

public class GameApplet extends PApplet {
	protected Drawable topLevelDrawable;
	protected RenderContext renderContext;

	@Override
	public void settings() {
		size(800, 600);
	}

	@Override
	public void setup() {
		this.topLevelDrawable = new Game();
		this.renderContext = new RenderContext(this);
	}

	@Override
	public void draw() {
		this.topLevelDrawable.draw(renderContext);
	}
}