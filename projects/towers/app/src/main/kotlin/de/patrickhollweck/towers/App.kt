package de.patrickhollweck.towers

import processing.core.PApplet

fun main() {
    PApplet.main("de.patrickhollweck.towers.App")
}

class App() : PApplet() {
    override fun settings() {
        size(200, 200)
    }

    override fun setup() {
        frameRate(1f)
        background(255)
    }

    override fun draw() {
        fill(255f, 255f, 255f)
        ellipse(20f, 20f, 20f, 20f)
    }
}
