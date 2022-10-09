package de.patrickhollweck.towers.entities

import de.patrickhollweck.towers.common.Position
import de.patrickhollweck.towers.entities.core.Entity
import processing.core.PApplet

class Track : Entity {
	val waypoints: List<Position>
	
	constructor(waypoints: List<Position>) {
		this.waypoints = waypoints	
	}
	
    override fun setup() {}

    override fun draw(graphics: PApplet) {
		val lines = mutableListOf<Pair<Position, Position>>()
		
		for ((index, waypoint) in waypoints.withIndex()) {
			if (index == 0) {
				continue
			}

			lines.add(Pair(waypoints[index - 1], waypoint))
		}
		
		for ((start, end) in lines) {
			graphics.line(
				start.x,
				start.y,
				end.x,
				end.y
			)
		}
	}
}
