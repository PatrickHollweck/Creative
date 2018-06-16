package empire

import processing.core.PApplet

class Empire : PApplet() {
	override fun settings() {
		size(640, 360)
	}

	override fun setup() {
		Empire.currentContext = this

		frameRate(120f)
	}

	override fun draw() {
		this.ellipse(this.mouseX.toFloat(), this.mouseY.toFloat(), 10f, 10f)
	}

	companion object {
		private var currentContext: PApplet? = null

		fun getContext(): PApplet {
			return when(currentContext) {
				null -> throw Error("Tried to get context before its initialized!")
				else -> currentContext!!
			}
		}
	}
}

fun main(args: Array<String>) {
	PApplet.main("empire.Empire")
}
