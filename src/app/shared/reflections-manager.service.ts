import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { WINDOW } from './window.provider';

type Coor = { x: number; y: number };

@Injectable({ providedIn: 'root' })
export class ReflectionsManager {
  private readonly _win = inject(WINDOW);
  private readonly _rendererFactory = inject(RendererFactory2);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _renderer = this._rendererFactory.createRenderer(null, null);

  private readonly _elements: Map<HTMLElement, Coor> = new Map();

  constructor() {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    // let to: ReturnType<typeof setTimeout>;

    this._renderer.listen(this._win, 'mousemove', (e: MouseEvent) => {
      // clearTimeout(to);
      // to = setTimeout(() => {
      for (const [el, pos] of Array.from(this._elements)) {
        const dX = pos.x - e.pageX;
        const dY = pos.y - e.pageY;
        const rad = Math.atan2(dY, dX);
        el.style.cssText = `--refl-deg: ${rad + 1.57}rad`;
      }
      // }, 20);
    });
  }

  addEntry(el: HTMLElement) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    const { x, y } = el.getBoundingClientRect();
    this._elements.set(el, { x, y });
  }

  removeEntry(el: HTMLElement) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this._elements.delete(el);
  }
}
