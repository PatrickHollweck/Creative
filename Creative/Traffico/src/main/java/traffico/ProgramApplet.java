package traffico;

import processing.core.PApplet;
import processing.event.KeyEvent;

import traffico.core.Traffico;
import traffico.core.events.KeydownEvent;
import traffico.drawable.render.PAppletRenderer;

public class ProgramApplet extends PApplet {
	private Traffico game;
	
	public ProgramApplet() {
		game = new Traffico();
		
		game.setRenderer(new PAppletRenderer(this));
	}
	
	@Override
	public void setup() {
		super.setup();
		game.setup();
	}

	@Override
	public void settings() {
		super.settings();
		this.size(800, 500);
	}

	@Override
	public void draw() {
		this.surface.setTitle("Traffico - FPS: " + this.frameRate);
		game.update();
		this.background(0);
	}

	@Override
	public void keyPressed(KeyEvent event) {
		super.keyPressed(event);
		game.onKeydown(KeydownEvent.fromProcessingKeyEvent(event));
	}
}
