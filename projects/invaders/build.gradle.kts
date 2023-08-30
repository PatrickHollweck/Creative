import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.9.10"
    application
}

group = "de.patrickhollweck"

version = "1.0-SNAPSHOT"

repositories { mavenCentral() }

dependencies {
    testImplementation(kotlin("test"))

    implementation(fileTree("libs") { include("*.jar") })
    implementation(kotlin("stdlib-jdk8"))
}

tasks.test { useJUnitPlatform() }

kotlin {
    // Set JVM Version
    jvmToolchain(19)
}

application {
    // Set main class
    mainClass.set("MainKt")
}

tasks {
    withType<JavaCompile> {
        options.release.set(19)
        options.encoding = "UTF-8"
    }

    withType<KotlinCompile> { kotlinOptions.jvmTarget = "19" }
}
