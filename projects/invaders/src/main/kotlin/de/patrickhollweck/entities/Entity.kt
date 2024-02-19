package de.patrickhollweck.entities

import processing.core.PGraphics

abstract class Entity {
	abstract fun update()
	abstract fun draw(graphics: PGraphics)
}
