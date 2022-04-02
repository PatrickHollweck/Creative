package de.patrickhollweck.towers

import processing.core.PApplet

class App() : PApplet() {
    override fun settings() {
        size(200, 200)
    }

    override fun setup() {
        frameRate(1f)
        background(255)
    }

    override fun draw() {
        ellipse(20f, 20f, 20f, 20f)
    }
}

fun main(args: Array<String>) {
    PApplet.main("de.patrickhollweck.towers.App")
}
