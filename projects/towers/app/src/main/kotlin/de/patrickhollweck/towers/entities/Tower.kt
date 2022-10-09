package de.patrickhollweck.towers.entities

import processing.core.PApplet

import de.patrickhollweck.towers.entities.core.PlacedEntity

class Tower(x: Float, y: Float) : PlacedEntity(x, y) {
    override fun setup() {}

    override fun draw(graphics: PApplet) {
        graphics.ellipse(position.x, position.y, 20f, 20f)
    }
}
