import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPlayerShortcut } from '../lib/keyboard';

const shortcuts = { Space: 'toggle', ArrowLeft: 'backward', ArrowRight: 'forward', ArrowUp: 'volumeUp', ArrowDown: 'volumeDown' } as const;

test('all player shortcuts remain available with button or pointer-focused slider', () => {
  for (const [code, action] of Object.entries(shortcuts)) {
    assert.equal(getPlayerShortcut({ code }), action);
    assert.equal(getPlayerShortcut({ code, nativeRange: false }), action);
  }
});

test('keyboard-focused sliders keep native arrows but Space controls playback', () => {
  for (const code of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']) {
    assert.equal(getPlayerShortcut({ code, nativeRange: true }), null);
  }
  assert.equal(getPlayerShortcut({ code: 'Space', nativeRange: true }), 'toggle');
});

test('editing, IME and modified key combinations are never intercepted', () => {
  for (const code of Object.keys(shortcuts)) {
    for (const options of [{ editable: true }, { composing: true }, { modified: true }]) {
      assert.equal(getPlayerShortcut({ code, ...options }), null);
    }
  }
});

test('Enter, Tab and browsing keys retain native behavior', () => {
  for (const code of ['Enter', 'Tab', 'Escape', 'Home', 'End', 'PageUp', 'PageDown']) {
    assert.equal(getPlayerShortcut({ code }), null);
  }
});
