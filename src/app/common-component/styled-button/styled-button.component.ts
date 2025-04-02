import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-styled-button',
  standalone: true,
  templateUrl: './styled-button.component.html',
  styleUrls: ['./styled-button.component.css']
})
export class StyledButtonComponent {
  @Input() label: string = 'Click Me';

  onClick() {
    console.log(`${this.label} button clicked`);
  }
}
