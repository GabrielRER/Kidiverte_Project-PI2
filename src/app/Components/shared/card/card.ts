import { Component } from '@angular/core';
import { StarRate } from '../star-rate/star-rate';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    StarRate
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {

  imageUrl = '/Images/minecraft_lego_image.png';

}
