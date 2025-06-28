import { Component } from '@angular/core';
import { ReflectiveSurfaceDirective } from './shared/reflective-surface.directive';

@Component({
  selector: 'gs-root',
  imports: [ReflectiveSurfaceDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
