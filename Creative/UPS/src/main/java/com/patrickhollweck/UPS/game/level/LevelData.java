package com.patrickhollweck.UPS.game.level;

import java.util.ArrayList;

public class LevelData {
	protected ArrayList<LevelObject> objects;

	public LevelData() {
		objects = new ArrayList<>();
	}

	public void addObject(LevelObject object) {
		objects.add(object);
	}

	public ArrayList<LevelObject> getObjects() {
		return objects;
	}
}