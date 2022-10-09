package de.patrickhollweck.towers.common

import de.patrickhollweck.towers.entities.Track
import de.patrickhollweck.towers.entities.core.PlacedEntity
import kotlin.math.sin

class TrackMover {
	private val track: Track
	private val entity: PlacedEntity
	
	private var nextWaypoint: Int = 1
	
	constructor(entity: PlacedEntity, track: Track) {
		this.track = track
		this.entity = entity
	}
	
	fun updatePosition() {
		var end = track.waypoints[nextWaypoint]
		var start = track.waypoints[nextWaypoint - 1]

			if (entity.position.y == end.y && entity.position.x == end.x) {
			if (track.waypoints.size <= nextWaypoint + 1) {
				return
			}

			nextWaypoint += 1
			end = track.waypoints[nextWaypoint]
			start = track.waypoints[nextWaypoint - 1]
		}

		val ancathete = start.distance(Position(start.x, end.y))
		val hypotenuse = start.distance(end)
		val angle = sin(ancathete / hypotenuse) * 360
		
		println(angle)
		
		if (entity.position.y != end.y) {
			entity.position.y += 2f
		}

		if (entity.position.x != end.x) {
			entity.position.x += 2f
		}
	}
}