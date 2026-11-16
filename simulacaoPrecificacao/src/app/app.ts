import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Produto } from "./produto/produto";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Produto],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('simulacaoPrecificacao');
}
