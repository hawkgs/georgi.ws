import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
} from '@angular/core';
import { WINDOW } from './window.provider';
import { appendCssVar } from './dom-utils';
import { renderReflectionSurfaceCenter } from './debug-utils/reflections';

const HALF_RAD = Math.PI / 2;
const REFL_ANGLE_VAR = 'refl-angle';
const INIT_DELAY = 0;

const DEFAULT_CONFIG: ReflectionConfig = {
  xOffset: 0,
  yOffset: 0,
  isFixed: false,
};

type Coor = { x: number; y: number };

export interface ReflectionConfig {
  xOffset: number;
  yOffset: number;
  isFixed: boolean;
}

interface ElementEntry {
  pos: Coor;
  config: ReflectionConfig;
}

function getConfig(config: Partial<ReflectionConfig> | undefined) {
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
}

@Injectable({ providedIn: 'root' })
export class ReflectionsManager {
  private readonly _win = inject(WINDOW);
  private readonly _rendererFactory = inject(RendererFactory2);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _renderer = this._rendererFactory.createRenderer(null, null);

  private readonly _elements: Map<HTMLElement, ElementEntry> = new Map();

  constructor() {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this._renderer.listen(this._win, 'mousemove', (e: MouseEvent) => {
      this._setReflectionAngle({
        x: e.pageX,
        y: e.pageY,
      });
    });
  }

  addEntry(el: HTMLElement, config?: Partial<ReflectionConfig>) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    const fullCfg = getConfig(config);

    setTimeout(() => {
      const { x, y, width, height } = el.getBoundingClientRect();

      // Store the central point
      const pos = {
        x: x + width / 2 + fullCfg.xOffset,
        y: y + height / 2 + fullCfg.yOffset,
      };
      this._elements.set(el, {
        pos,
        config: fullCfg,
      });

      // DEBUG
      // renderReflectionSurfaceCenter(pos, fullCfg.isFixed);
    }, INIT_DELAY);
  }

  removeEntry(el: HTMLElement) {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this._elements.delete(el);
  }

  private _setReflectionAngle({ x, y }: Coor) {
    for (const [el, { pos, config }] of Array.from(this._elements)) {
      let fixedOffset: Coor = { x: 0, y: 0 };
      if (config.isFixed) {
        fixedOffset = {
          x: this._win.scrollX,
          y: this._win.scrollY,
        };
      }

      const dX = pos.x + fixedOffset.x - x;
      const dY = pos.y + fixedOffset.y - y;
      const rad = Math.atan2(dY, dX);

      appendCssVar(el, REFL_ANGLE_VAR, `${rad + HALF_RAD}rad`);
    }
  }
}
