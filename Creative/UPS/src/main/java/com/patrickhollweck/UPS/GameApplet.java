package com.patrickhollweck.UPS;

import com.patrickhollweck.UPS.game.Game;

import com.patrickhollweck.UPS.game.Entity;
import com.patrickhollweck.UPS.game.RenderContext;

import processing.core.PApplet;

public class GameApplet extends PApplet {
	protected Entity topLevelDrawable;
	protected RenderContext renderContext;

	@Override
	public void settings() {
		size(800, 600);
	}

	@Override
	public void setup() {
		this.renderContext = new RenderContext(this);

		this.topLevelDrawable = new Game();
		this.topLevelDrawable.setup(renderContext);
	}

	@Override
	public void draw() {
		this.topLevelDrawable.draw(renderContext);
	}
}