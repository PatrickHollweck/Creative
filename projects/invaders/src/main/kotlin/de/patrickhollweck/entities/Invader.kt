package de.patrickhollweck.entities

import de.patrickhollweck.support.Position
import processing.core.PGraphics

class Invader : Entity() {
	private val position = Position()

	override fun update() {
		position.x += 1
	}

	override fun draw(graphics: PGraphics) {
		graphics.circle(position.x.toFloat(), position.y.toFloat(), 10f)
	}
}
