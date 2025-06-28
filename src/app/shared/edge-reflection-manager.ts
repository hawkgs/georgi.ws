import { inject, Injectable, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EdgeReflectionManager {
  private readonly _rendererFactory = inject(RendererFactory2);
  private readonly _renderer = this._rendererFactory.createRenderer(null, null);

  private readonly _pos: Map<HTMLElement, { x: number; y: number }> = new Map();

  constructor() {
    // let to: ReturnType<typeof setTimeout>;

    this._renderer.listen('window', 'mousemove', (e: MouseEvent) => {
      // clearTimeout(to);
      // to = setTimeout(() => {
      for (const [el, pos] of Array.from(this._pos)) {
        const dX = pos.x - e.pageX;
        const dY = pos.y - e.pageY;
        const rad = Math.atan2(dY, dX);
        el.style.cssText = `--refl-deg: ${rad + 1.57}rad`;
      }
      // }, 20);
    });
  }

  addEntry(e: HTMLElement) {
    const { x, y } = e.getBoundingClientRect();
    this._pos.set(e, { x, y });
  }

  removeEntry(e: HTMLElement) {
    this._pos.delete(e);
  }
}
