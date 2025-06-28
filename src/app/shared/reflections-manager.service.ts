import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { WINDOW } from './window.provider';

const HALF_RAD = Math.PI / 2;
const REFL_ANGLE_VAR = '--refl-angle';

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
        el.style.cssText = `${REFL_ANGLE_VAR}: ${rad + HALF_RAD}rad`;
      }
      // }, 20);
    });
  }

  addEntry(el: HTMLElement) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    const { x, y, width, height } = el.getBoundingClientRect();
    // Store the central point
    this._elements.set(el, {
      x: x + width / 2,
      y: y + height / 2,
    });
  }

  removeEntry(el: HTMLElement) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this._elements.delete(el);
  }
}
