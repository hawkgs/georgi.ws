import {
  afterRenderEffect,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import {
  ReflectionConfig,
  ReflectionsManager,
} from './reflections-manager.service';

@Directive({
  selector: '[gsReflectiveSurface]',
})
export class ReflectiveSurfaceDirective implements OnDestroy {
  private readonly _reflections = inject(ReflectionsManager);
  private readonly _elRef = inject(ElementRef);

  /* We use `string` type since we want to be able to apply the directive without config. */
  readonly config = input<Partial<ReflectionConfig> | string>('', {
    alias: 'gsReflectiveSurface',
  });

  constructor() {
    afterRenderEffect({
      write: () => {
        const cfgInput = this.config();
        const config = typeof cfgInput !== 'string' ? cfgInput : undefined;
        this._reflections.addEntry(this._elRef.nativeElement, config);
      },
    });
  }

  ngOnDestroy() {
    this._reflections.removeEntry(this._elRef.nativeElement);
  }
}
