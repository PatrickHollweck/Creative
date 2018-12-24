package com.patrickhollweck.UPS.game.level;

import java.awt.Color;

import com.patrickhollweck.UPS.game.layout.RectanglePosition;

public class LevelObject {
	protected Color color;
	protected boolean isSolid;
	protected RectanglePosition position;

	public LevelObject(RectanglePosition position, boolean isSolid, Color color) {
		this.color = color;
		this.isSolid = isSolid;
		this.position = position;
	}

	public RectanglePosition getPosition() {
		return position;
	}

	public Color getColor() {
		return color;
	}

	public boolean isPassable() {
		return isSolid;
	}
}