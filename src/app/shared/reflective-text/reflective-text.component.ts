import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  viewChild,
} from '@angular/core';
import { ReflectionsManager } from '../reflections-manager.service';

type TextType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

@Component({
  selector: 'gs-reflective-text',
  templateUrl: './reflective-text.component.html',
  styleUrl: './reflective-text.component.scss',
})
export class ReflectiveTextComponent implements OnDestroy {
  private readonly _elRef = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _reflections = inject(ReflectionsManager);

  private _letterEl: HTMLElement[] = [];
  private readonly _content = viewChild.required<ElementRef>('content');
  private readonly _text = computed(
    () => this._content().nativeElement.innerText,
  );

  type = input<TextType>('p');

  constructor() {
    afterNextRender({
      write: () => this._renderText(),
    });
  }

  ngOnDestroy() {
    this._cleanUpReflections();
  }

  private _renderText() {
    const text = this._renderer.createElement(this.type());
    text.innerText = this._text();
    this._renderer.addClass(text, 'text');

    const letters = this._renderer.createElement('p');
    this._renderer.addClass(letters, 'reflections');
    this._renderer.addClass(letters, `type-${this.type()}`);
    this._renderer.setAttribute(letters, 'aria-hidden', 'true');

    for (const letter of this._text()) {
      const letterEl = this._renderer.createElement('span');
      letterEl.innerText = letter;
      this._renderer.setAttribute(letterEl, 'data-lt', letter);
      this._renderer.appendChild(letters, letterEl);

      this._letterEl.push(letterEl);
      this._reflections.addEntry(letterEl);
    }

    this._renderer.appendChild(this._elRef.nativeElement, letters);
    this._renderer.appendChild(this._elRef.nativeElement, text);
  }

  private _cleanUpReflections() {
    for (const letterEl of this._letterEl) {
      this._reflections.removeEntry(letterEl);
    }
    this._letterEl = [];
  }
}
