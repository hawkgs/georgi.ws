import { Component } from '@angular/core';
import { ReflectiveSurfaceDirective } from './shared/reflective-surface.directive';
import { ReflectiveTextComponent } from './shared/reflective-text/reflective-text.component';

@Component({
  selector: 'gs-root',
  imports: [ReflectiveSurfaceDirective, ReflectiveTextComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
