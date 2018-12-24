package com.patrickhollweck.UPS.game.level;

import java.awt.Color;

import com.patrickhollweck.UPS.game.layout.Position;
import com.patrickhollweck.UPS.game.layout.RectanglePosition;

public class LevelObjectFactory {
	public static LevelObject makeRoad(RectanglePosition position) {
		return new LevelObject(position, false, Color.BLACK);
	}

	public static LevelObject makeHouse(RectanglePosition position) {
		return new LevelObject(position, true, Color.GREEN);
	}

	public static LevelObject makeWaypoint(Position position) {
		final float radius = 2.5f;
		Position topLeft = new Position(position.getX() - radius, position.getY() - radius);
		Position bottomRight = new Position(position.getX() + radius, position.getY() + radius);

		return new LevelObject(new RectanglePosition(topLeft, bottomRight), false, Color.RED);
	}
}