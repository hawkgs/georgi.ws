import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { EdgeReflectionManager } from './edge-reflection-manager';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[gsEdgeReflection]',
})
export class EdgeReflectionDirective implements OnDestroy {
  private readonly _refl = inject(EdgeReflectionManager);
  private readonly _el = inject(ElementRef);
  private readonly _id = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this._id)) {
      this._refl.addEntry(this._el.nativeElement);
    }
  }

  ngOnDestroy() {
    this._refl.removeEntry(this._el.nativeElement);
  }
}
