import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
  <h1>Hello World</h1>
  <h2>This is DunaDev Frontend!</h2>`,
  styles: `
  h1 {
    color: red;
  }`
})
export class App {
  protected readonly title = signal('dunadev-frontend');
}
