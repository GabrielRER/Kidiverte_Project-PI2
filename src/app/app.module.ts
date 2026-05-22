import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

@NgModule({

  imports: [
    FormsModule,
  ],

  providers: [
    provideHttpClient()
  ]
})

export class AppModule {}