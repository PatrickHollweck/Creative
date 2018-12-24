package com.patrickhollweck.UPS.game.layout;

import java.awt.Color;

import com.patrickhollweck.UPS.game.RenderContext;

public class RectangleRenderer {
	public static void Display(RenderContext context, RectanglePosition position) {
		Position topLeft = position.getTopLeft();
		Position bottomRight = position.getBottomRight();

		context.gl.rect(topLeft.getX(), topLeft.getY(), bottomRight.getX(), bottomRight.getY());
	}

	public static void Display(RenderContext context, RectanglePosition position, Color color) {
		Position topLeft = position.getTopLeft();
		Position bottomRight = position.getBottomRight();

		SetColor(context, color);
		context.gl.rect(topLeft.getX(), topLeft.getY(), bottomRight.getX(), bottomRight.getY());
		SetColor(context, context.backgroundColor);
	}

	protected static void SetColor(RenderContext context, Color color) {
		context.gl.fill(color.getRed() + 150, color.getGreen(), color.getBlue());
	}
}