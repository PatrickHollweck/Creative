package de.patrickhollweck.towers.entities.core

import de.patrickhollweck.towers.common.Position

abstract class PlacedEntity : Entity {
	var position: Position
	
	constructor(x: Float, y: Float) {
		position = Position(x, y)
	}
}