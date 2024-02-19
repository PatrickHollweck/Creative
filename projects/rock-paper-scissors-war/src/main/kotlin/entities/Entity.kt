package entities

import processing.core.PGraphics
import support.Position
import kotlin.random.Random

class RockEntity(yBound: Int, xBound: Int, position: Position) : Entity(yBound, xBound, position)
class PaperEntity(yBound: Int, xBound: Int, position: Position) : Entity(yBound, xBound, position)
class ScissorEntity(yBound: Int, xBound: Int, position: Position) : Entity(yBound, xBound, position)

sealed class Entity(
	private var yBound: Int,
	private var xBound: Int,
	private val position: Position
) {
	private val size = 10

	fun update() {
		position.x += Random.nextInt(-10, 10)
		position.y += Random.nextInt(-10, 10)

		if (position.x < 0) {
			position.x = 0
		}

		if (position.x > xBound) {
			position.x = xBound
		}

		if (position.y > yBound) {
			position.y = yBound
		}

		if (position.y < 0) {
			position.y = 0
		}
	}

	fun draw(graphics: PGraphics) {
		graphics.fill(255f, 255f, 255f)

		graphics.circle(
			position.x.toFloat(),
			position.y.toFloat(),
			size.toFloat()
		)
	}
}