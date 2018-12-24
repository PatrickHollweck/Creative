package com.patrickhollweck.UPS.game;

import java.awt.Color;

import processing.core.PApplet;

public class RenderContext {
	public final PApplet gl;

	public final Color backgroundColor = Color.WHITE;

	public RenderContext(PApplet gl) {
		this.gl = gl;
	}
}