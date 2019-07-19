package traffico.core;

import traffico.core.events.KeydownEvent;
import traffico.drawable.render.*;

public class Traffico {
	private Renderer renderer;

	public void setup() {
	}
	
	public void update() {
		if(this.renderer == null) {
			throw new IllegalStateException("Renderer must not be null");
		}
	}
	
	public void onKeydown(KeydownEvent event) {
	}

	public Renderer getRenderer() {
		return renderer;
	}

	public void setRenderer(Renderer renderer) {
		this.renderer = renderer;
	}
}
