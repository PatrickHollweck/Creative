package de.patrickhollweck.towers.screens

import de.patrickhollweck.towers.common.Position
import de.patrickhollweck.towers.entities.Enemy
import de.patrickhollweck.towers.entities.Track

import processing.core.PApplet

class GameScreen : Screen() {
	private val entities = mutableListOf(
		Enemy(this),
		getCurrentTrack()
	)

	override fun setup() {
		entities.forEach {
			it.setup()
		}
	}

	override fun draw(graphics: PApplet) {
		entities.forEach {
			it.draw(graphics)
		}
	}
	
	fun getCurrentTrack(): Track {
		return Track(mutableListOf(
			Position(0f, 0f),
			Position(200f, 200f),
			Position(400f, 600f),
			Position(1200f, 800f)
		))
	}
}