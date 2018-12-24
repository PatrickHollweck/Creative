package com.patrickhollweck.UPS.game;

import com.patrickhollweck.UPS.game.level.Level;
import com.patrickhollweck.UPS.game.level.LevelGenerator;

public class Game implements Entity {
	Level level;

	@Override
	public void setup(RenderContext context) {
		try {
			level = new Level(LevelGenerator.makeLevel(context.gl.width, context.gl.height));
		} catch (Exception e) {
			context.gl.text(e.getMessage(), 0, 0);
		}
	}

	@Override
	public void draw(RenderContext context) {
		level.renderer.draw(context);
	}

}