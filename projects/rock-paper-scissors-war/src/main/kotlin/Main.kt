import entities.Entity
import entities.PaperEntity
import entities.RockEntity
import processing.core.PApplet
import processing.core.PConstants
import support.Position

fun main() {
	PApplet.main(App::class.java)
}

class App : PApplet() {
	private val entities = mutableListOf<Entity>()

	override fun settings() {
		super.settings()

		size(640, 360, PConstants.JAVA2D)
	}

	override fun setup() {
		super.setup()

		frameRate(10f)

		entities.addAll(
			listOf(
				RockEntity(
					width,
					height,
					Position(width / 2, height / 2)
				),
				PaperEntity(
					width,
					height,
					Position(width / 2 + 10, height / 2 + 10)
				)
			)
		)
	}

	override fun draw() {
		background(0)

		entities.forEach {
			it.update()
		}
		


		entities.forEach {
			it.draw(this.graphics)
		}

		circle(mouseX.toFloat(), mouseY.toFloat(), 10f)
	}
}
