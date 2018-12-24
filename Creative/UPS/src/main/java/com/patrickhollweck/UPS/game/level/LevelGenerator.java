package com.patrickhollweck.UPS.game.level;

import com.patrickhollweck.UPS.game.layout.Position;
import com.patrickhollweck.UPS.game.layout.RectanglePosition;

public class LevelGenerator {
	protected LevelData levelData;

	protected int width;
	protected int height;

	public LevelGenerator(int width, int height) {
		this.levelData = new LevelData();

		this.width = width;
		this.height = height;
	}

	public static LevelData makeLevel(int width, int height) throws Exception {
		LevelGenerator generator = new LevelGenerator(width, height);
		generator.generate();

		return generator.levelData;
	}

	protected void generate() throws Exception {
		final int blockSize = 50;

		if (width % blockSize != 0 || width % blockSize != 0) {
			throw new Exception(
					"Could not generate level! The level could not be divided in equally sized blocks. Invalid Dimensions");
		}

		for (int xLevel = 0; xLevel < width; xLevel += blockSize) {
			System.out.println("(" + xLevel + " - " + 0 + ") / (" + (xLevel + blockSize) + " - " + height + ")");
			addRoad(makePosition(xLevel, 0, xLevel + blockSize, height));
		}
	}

	protected Position makePosition(int x, int y) {
		return new Position(x, y);
	}

	protected RectanglePosition makePosition(int xa, int ya, int xb, int yb) {
		return new RectanglePosition(xa, ya, xb, yb);
	}

	protected void addRoad(RectanglePosition position) {
		this.levelData.addObject(LevelObjectFactory.makeRoad(position));
	}

	protected void addHouse(RectanglePosition position) {
		this.levelData.addObject(LevelObjectFactory.makeHouse(position));
	}

	protected void addWaypoint(Position position) {
		this.levelData.addObject(LevelObjectFactory.makeWaypoint(position));
	}
}