package com.patrickhollweck.UPS.game.level;

public class Level {
	public final LevelRenderer renderer;
	public final LevelData data;

	public Level(LevelData data) {
		this.data = data;
		this.renderer = new LevelRenderer(data);
	}
}