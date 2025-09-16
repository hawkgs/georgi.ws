import { Component, inject } from '@angular/core';
import { ReflectiveSurfaceDirective } from './shared/reflective-surface.directive';
import { ReflectiveTextComponent } from './shared/reflective-text/reflective-text.component';
import { ReflectionConfig } from './shared/reflections-manager.service';
import { Lights } from './shared/lights.service';
import { LightSurfaceDirective } from './shared/light-surface.directive';

@Component({
  selector: 'gs-root',
  imports: [
    ReflectiveSurfaceDirective,
    LightSurfaceDirective,
    ReflectiveTextComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  lights = inject(Lights);

  hCfg: Partial<ReflectionConfig> = {
    yOffset: -200,
    isFixed: true,
  };
}
