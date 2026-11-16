import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Produto } from "../models/produto"
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ProdutoServices {
	
	private readonly API_URL = "/api/produtos";
	
	constructor(private http: HttpClient) {}
	
	
	buscarProdutos(loja: number, grupoInicial: number, grupoFinal: number): Observable<Produto[]> {
		
		const params = new HttpParams()
		.set("loja", loja.toString())
		.set("grupoInicial", grupoInicial.toString())
		.set("grupoFinal", grupoFinal.toString());
		
		return this.http.get<any>(this.API_URL, {params});
	}  
	
	
	buscarProduto(loja: number, codigo: number): Observable<Produto[]> {
		
		const params = new HttpParams()
		.set("loja", loja.toString())
		.set("codigo", codigo.toString());
		
		return this.http.get<Produto[]>(`${this.API_URL}/buscar`, {params});
	}
}
