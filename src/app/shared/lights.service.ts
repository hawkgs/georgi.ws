import { inject, Injectable, RendererFactory2 } from '@angular/core';

const LIGHTS_READY_CLASS = 'gs-lights-ready';
const LIGHTS_OFF_CLR_CLASS = 'gs-lights-color-off';
const LIGHTS_OFF_TRANSP_CLASS = 'gs-lights-transparency-off';

export type LightingStrategy = 'transparency' | 'color';

type Surface = {
  element: HTMLElement;
  strategy: LightingStrategy;
};

const getStrategyClass = (strategy: LightingStrategy) =>
  strategy === 'color' ? LIGHTS_OFF_CLR_CLASS : LIGHTS_OFF_TRANSP_CLASS;

@Injectable({ providedIn: 'root' })
export class Lights {
  private readonly _rendererFactory = inject(RendererFactory2);
  private readonly _renderer = this._rendererFactory.createRenderer(null, null);

  private _surfaces: Surface[] = [];

  addSurface(element: HTMLElement, strategy: LightingStrategy) {
    this._surfaces.push({
      element,
      strategy,
    });
    this._renderer.addClass(element, LIGHTS_READY_CLASS);
  }

  removeSurface(element: HTMLElement) {
    const idx = this._surfaces.findIndex((el) => el.element === element);
    if (idx > -1) {
      this._surfaces.splice(idx, 1);
    }
  }

  on() {
    for (const { element, strategy } of this._surfaces) {
      const className = getStrategyClass(strategy);
      this._renderer.removeClass(element, className);
    }
  }

  off() {
    for (const { element, strategy } of this._surfaces) {
      const className = getStrategyClass(strategy);
      this._renderer.addClass(element, className);
    }
  }
}
