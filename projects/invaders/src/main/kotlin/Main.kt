import processing.core.PApplet
import processing.core.PConstants

fun main() {
    PApplet.main(App::class.java)
}

class App : PApplet() {
    override fun settings() {
        size(640, 360, PConstants.JAVA2D)
    }

    override fun setup() {}

    override fun draw() {
        println(mouseX)

        circle(mouseX.toFloat(), mouseY.toFloat(), 10.toFloat())
    }
}
