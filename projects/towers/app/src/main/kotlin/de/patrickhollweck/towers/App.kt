package de.patrickhollweck.towers

import de.patrickhollweck.towers.screens.GameScreen
import de.patrickhollweck.towers.screens.Screen
import processing.core.PApplet

fun main() {
    PApplet.main("de.patrickhollweck.towers.App")
}

class App() : PApplet() {
	private val screen: Screen = GameScreen()
	
    override fun settings() {
        size(1200, 800)
    }

    override fun setup() {
        frameRate(30f)
		
		screen.setup()
    }

    override fun draw() {
        background(255)

		screen.draw(this)
	}
}
