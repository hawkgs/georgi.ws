import { Directive, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { LightingStrategy, Lights } from './lights.service';

@Directive({
  selector: '[gsLightSurface]',
})
export class LightSurfaceDirective implements OnDestroy {
  private readonly _lights = inject(Lights);
  private readonly _elementRef = inject(ElementRef);

  readonly strategy = input<LightingStrategy>('color', {
    alias: 'gsLightSurface',
  });

  constructor() {
    this._lights.addSurface(this._elementRef.nativeElement, this.strategy());
  }

  ngOnDestroy() {
    this._lights.removeSurface(this._elementRef.nativeElement);
  }
}
