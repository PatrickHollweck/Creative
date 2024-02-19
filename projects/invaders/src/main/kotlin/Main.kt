import de.patrickhollweck.entities.Entity
import de.patrickhollweck.entities.Invader
import processing.core.PApplet
import processing.core.PConstants

fun main() {
	PApplet.main(App::class.java)
}

class App : PApplet() {
	private val entities: ArrayList<Entity> = ArrayList()

	override fun setup() {
		entities.add(Invader())
	}

	override fun settings() {
		size(640, 360, PConstants.JAVA2D)
	}

	override fun draw() {
		background(0)

		for (entity in entities) {
			entity.update()
		}

		for (entity in entities) {
			entity.draw(this.graphics)
		}
	}
}
