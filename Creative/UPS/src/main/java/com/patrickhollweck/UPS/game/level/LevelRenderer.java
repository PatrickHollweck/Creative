package com.patrickhollweck.UPS.game.level;

import com.patrickhollweck.UPS.game.Drawable;
import com.patrickhollweck.UPS.game.RenderContext;
import com.patrickhollweck.UPS.game.layout.RectangleRenderer;;

public class LevelRenderer implements Drawable {
	protected LevelData level;

	public LevelRenderer(LevelData level) {
		this.level = level;
	}

	@Override
	public void draw(RenderContext context) {
		for (LevelObject object : level.objects) {
			RectangleRenderer.Display(context, object.getPosition(), object.getColor());
		}
	}

}