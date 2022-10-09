package de.patrickhollweck.towers.common

import processing.core.PApplet

interface Drawable {
	fun setup()
	fun draw(graphics: PApplet)
}
