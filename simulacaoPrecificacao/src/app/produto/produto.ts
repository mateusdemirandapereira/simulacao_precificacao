import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ProdutoServices } from "../services/produto-services";
import { FormsModule } from "@angular/forms";
import { Produto as ProdutoModel } from "../models/produto";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-produto',
  imports: [CommonModule, MatTableModule, MatInputModule, MatButtonModule, FormsModule, MatToolbarModule],
  templateUrl: './produto.html',
  styleUrl: './produto.css',
})
export class Produto implements OnInit {
	
	loja = 1;
	grupoInicial = 170001;
	grupoFinal = 171501;
	codigo:number | null = null;
	margemBruta: number | null = null;
	operacional: number | null = null;
	desconto: number | null = null;
	filtroExportacao: "todos" | "positivo" | "negativo" = "todos";
	
	
	listaDeProdutos = new MatTableDataSource<ProdutoModel>([]);
	colunasExibidas: string[] = ["codigo", "descricao","grupo", "estoque", "custo", "precoOriginal", "novoPreco","variacaoPreco" ,"margemBruta",
		"novaMargemBruta", "varMargemBruta", "desconto", "novoDesconto" ,"precoComDesconto", "novoPrecoComDesconto", "varPrecoComDesconto",
		 "lucratividadePorcentagem", "novaLucratividadePorcentagem", "varMargemReal", "icms", "pisCofins", "csllIrpj",
		 "operacional", "novoOperacional"];
	
	constructor(private produtoServices: ProdutoServices) {}
	
	ngOnInit(): void {}
	
	carregarProdutos(): void {
		
		this.produtoServices.buscarProdutos(this.loja, this.grupoInicial, this.grupoFinal).subscribe({
			
			next: (dados) => {				
				
				this.listaDeProdutos.data = this.inicializarValoresProduto(dados);
				console.log("Produtos carregados com sucesso:", dados);
			},
			error: (erro) => {
				console.error("Erro ao buscar produtos:", erro);
			}
		});
	}
	
	
	buscarProduto(): void {
		
		if (this.codigo === null) {
			
			console.log("Informe o codigo do produto.");
			
			return;
		}
		
		
		this.produtoServices.buscarProduto(this.loja, this.codigo).subscribe({
			
			next: (dados) => {
				
								
				this.listaDeProdutos.data = this.inicializarValoresProduto(dados);
				
				console.log("Produto carregado com sucesso: ", dados);
				
			},
			
			error: (erro) => {
				
				console.error("Erro ao buscar produto: ", erro);
			}
		});
	}
	
	
	private inicializarValoresProduto(dados: ProdutoModel[]): ProdutoModel[] {
		
		dados.forEach((produto: ProdutoModel) => {
			
			produto.novoPreco = 0;
			produto.varPreco= 0;
			produto.novaMargemBruta = 0;
			produto.novoPrecoComDesconto = 0;
			produto.varPrecoComDesconto = 0;
			produto.novaLucratividade = 0;
			produto.novaLucratividadePorcentagem = 0;
			produto.novoDesconto = 0;
			produto.novaMargemBruta = 0;
			produto.novoOperacional= 0;
			produto.varMargemBruta = 0;
			produto.varPrecoComDesconto = 0;
			produto.varMargemReal = 0;
			
		});
		
		
		return dados;		
		
		
	}
	
	
	recalcularPrecificacao(): void {
		const produtos = this.listaDeProdutos.data;
		
		produtos.forEach(produto => {
			
			const novaMargemBruta = this.margemBruta ?? produto.margemBruta;
			const novoOperacional = this.operacional ?? produto.operacional;
			const novoDesconto = this.desconto ?? produto.desconto;
			
			produto.novaMargemBruta = novaMargemBruta;
			produto.novoOperacional = novoOperacional;
			produto.novoDesconto = novoDesconto;
			
					
			produto.novoPreco = this.novoPreco(produto.custo, produto.icms, produto.csllIrpj, produto.pisCofins,
				produto.novoOperacional, produto.novaMargemBruta);	
				
			
			produto.varPreco = this.variacao(produto.precoOriginal, produto.novoPreco);		
			
			produto.novoPrecoComDesconto = this.novoPrecoComDesconto(produto.novoPreco, produto.novoDesconto);	
			
			produto.varPrecoComDesconto = this.variacao(produto.precoComDesconto, produto.novoPrecoComDesconto);
			
			
				 
				 
			produto.novaLucratividade = this.lucratividade(
				produto.novoPrecoComDesconto, produto.custo, produto.icms, produto.pisCofins,produto.csllIrpj,
				produto.novoOperacional);
				
				
			produto.novaLucratividadePorcentagem = produto.novaLucratividade / produto.novoPrecoComDesconto * 100;
			
			
			produto.varMargemReal = produto.lucratividadePorcentagem - produto.novaLucratividadePorcentagem;
			
			produto.varMargemBruta = produto.margemBruta - produto.novaMargemBruta;
		
			
			
			 
		});
	}
	
	private variacao(preco:number, novoPreco:number) {
	
	return (novoPreco - preco) / preco * 100;
	}
	
	
 	private novoPreco(custo: number, icms: number, csllIrpj: number, pisCofins: number, operacional: number, margem: number): number {
		
		const impostos = (icms + csllIrpj + this.removerIcmsPisCofins(icms, pisCofins) + operacional
		+ margem) / 100;
		
		
		
		return custo / (1 - impostos);
		
		
		
	}
	
	
	private novoPrecoComDesconto(preco: number, desconto: number) {
	
	return parseFloat(((100 - desconto) / 100 * preco).toFixed(5));
	}
	
	
	private removerIcmsPisCofins(icms: number,pisCofins: number): number {
		
		
		return (100 - icms) / 100 * pisCofins;
	}	
	

	
	
	private lucratividade(preco: number, custo:number, icms: number, pisCofins: number, csllIrpj: number, op: number) {
		
		
		
		return preco - custo - this.valorPisCofins(preco, icms, pisCofins) 
			- this.valorCsllIrpj(csllIrpj, preco) - this.valorOperacional(op, preco) - this.valorIcms(icms, preco);
		
	}
	
	private valorPisCofins(preco: number, icms: number, pisCofins: number): number {
		
			return	(100 - icms) / 100 * pisCofins / 100 * preco;
	}
	
	
	private valorCsllIrpj(csllIrpj: number, preco: number): number {
		
		return csllIrpj / 100 * preco;
	}
	
	private valorOperacional(op:number, preco: number): number {
		
		return  op / 100 * preco;
	}
	
	
	private valorIcms(icms:number, preco:number): number {
		
		return icms / 100 * preco;
	}
	
	
	
		
		
	exportarExcel(): void {
		
		const produtosAtuais = this.listaDeProdutos.data;
		
		let produtosParaExportar = produtosAtuais;
		
		if (this.filtroExportacao === "positivo") {
			
			produtosParaExportar = produtosAtuais.filter(produto => produto.lucratividade > 0);
		}
		
		
		if (this.filtroExportacao === "negativo") {
			
			produtosParaExportar = produtosAtuais.filter(produto => produto.lucratividade < 0);
		}
		
		
		const dadosExcel = produtosParaExportar.map(produto => ({
			
			"CODIGO": produto.codigo,
			"DESCRICAO": produto.descricao,
			"CODIGO GRUPO": produto.grupo,
			"ESTOQUE": produto.estoque,
			"PRECO CUSTO": produto.custo,
			"PRECO ORIGINAL": produto.precoOriginal,
			"NOVO PRECO": produto.novoPreco,
			"VAR1 (%)":produto.varPreco,
            "MARGEM BRUTA (%)": produto.margemBruta,
			"NOVA MARGEM BRUTA (%)": produto.novaMargemBruta,
			"VAR MARGEM BRUTA (%)": produto.varMargemBruta,
			"DESCONTO (%)": produto.desconto,
			"NOVO DESCONTO (%)": produto.novoDesconto,
			"PRECO C/ DESCONTO": produto.precoComDesconto,
			"NOVO PRECO C/ DESCONTO": produto.novoPrecoComDesconto,
			"VAR2 (%)": produto.varPrecoComDesconto,
			"MARGEM REAL (%)": produto.lucratividadePorcentagem,
			"NOVA MARGEM REAL (%)": produto.novaLucratividadePorcentagem,
			"VAR MARGEM REAL (%)": produto.varMargemReal,
			"ICMS (%)": produto.icms,
			"PIS/COFINS (%)": produto.pisCofins,
			"CSLL/IRPJ (%)": produto.csllIrpj,
			"OPERACIONAL (%)": produto.operacional,
			"NOVO OPERACIONAL (%)": produto.novoOperacional			
			
		}));
		
		
		const planilha = XLSX.utils.json_to_sheet(dadosExcel);
		
		const arquivo = XLSX.utils.book_new();
		
		XLSX.utils.book_append_sheet(arquivo, planilha, "Produtos");
		
		XLSX.writeFile(arquivo, "simulacao-precificacao.xlsx");
	}
		
}
