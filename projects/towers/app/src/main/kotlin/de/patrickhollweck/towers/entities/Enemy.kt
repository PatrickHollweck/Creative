package de.patrickhollweck.towers.entities

import de.patrickhollweck.towers.common.TrackMover
import de.patrickhollweck.towers.screens.GameScreen
import de.patrickhollweck.towers.entities.core.PlacedEntity

import processing.core.PApplet

class Enemy : PlacedEntity {
	private val mover: TrackMover
	
	constructor(game: GameScreen): super(0f, 0f) {
		mover = TrackMover(this, game.getCurrentTrack());
	}
	
	override fun setup() {}

	override fun draw(graphics: PApplet) {
		mover.updatePosition()
		graphics.ellipse(position.x, position.y, 10f, 10f)
	}
}