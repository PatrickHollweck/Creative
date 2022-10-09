package de.patrickhollweck.towers.common

import kotlin.math.abs

data class Position(var x: Float, var y: Float) {
	fun distance(other: Position): Float {
		return abs(other.x - x + other.y - y)
	}
}
