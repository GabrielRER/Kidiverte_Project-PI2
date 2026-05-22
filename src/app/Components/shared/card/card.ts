import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-card',
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {

  imageUrl = 'https://picsum.photos/400/200';

}
