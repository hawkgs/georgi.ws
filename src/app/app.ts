import { Component } from '@angular/core';
import { EdgeReflectionDirective } from './shared/edge-reflection.directive';

@Component({
  selector: 'gs-root',
  imports: [EdgeReflectionDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'georgi.ws';
}
