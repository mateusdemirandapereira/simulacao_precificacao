import { Routes } from '@angular/router';
import { Produto } from "./produto/produto";

export const routes: Routes = [
	
	{
		path: "simulacao",
		component: Produto
	},
	
	{
		path: "",
		redirectTo: "simulacao",
		pathMatch: "full"
	}
	
];
