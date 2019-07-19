package traffico.core.events;

import processing.event.KeyEvent;

public class KeydownEvent {
	private char key;
	
	public KeydownEvent(char key) {
		this.key = key;
	}

	public char getKey() {
		return key;
	}

	public void setKey(char key) {
		this.key = key;
	}
	
	public static KeydownEvent fromProcessingKeyEvent(KeyEvent event) {
		return new KeydownEvent(event.getKey());
	}
}
