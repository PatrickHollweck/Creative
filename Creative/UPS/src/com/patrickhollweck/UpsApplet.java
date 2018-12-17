package com.patrickhollweck;

import processing.core.PApplet;

public class UpsApplet extends PApplet {
	private static PApplet INSTANCE;

	private UpsApplet() {
		INSTANCE = this;
	}

	@Override
	public void settings() {
		size(500 ,500);
	}

	@Override
	public void draw() {
		point(mouseX, mouseY);
	}

	public static PApplet getContext() {
		return INSTANCE;
	}
}
