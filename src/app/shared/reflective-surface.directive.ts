import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import { ReflectionsManager } from './reflections-manager.service';

@Directive({
  selector: '[gsReflectiveSurface]',
})
export class ReflectiveSurfaceDirective implements OnDestroy {
  private readonly _reflections = inject(ReflectionsManager);
  private readonly _elRef = inject(ElementRef);

  constructor() {
    this._reflections.addEntry(this._elRef.nativeElement);
  }

  ngOnDestroy() {
    this._reflections.removeEntry(this._elRef.nativeElement);
  }
}
