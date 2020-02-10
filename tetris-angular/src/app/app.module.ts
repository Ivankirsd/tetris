import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { MenuComponent } from './components/menu/menu.component';
import { ScoreComponent } from './components/score/score.component';
import { FigureComponent } from './components/score/figure/figure.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MenuComponent,
    ScoreComponent,
    FigureComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
