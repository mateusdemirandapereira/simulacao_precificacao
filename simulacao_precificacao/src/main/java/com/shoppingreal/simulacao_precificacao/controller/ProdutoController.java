package com.shoppingreal.simulacao_precificacao.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shoppingreal.simulacao_precificacao.service.ProdutoService;
import com.shoppingreal.simulacao_precificacao.model.Produto;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
	
	
	private final ProdutoService produtoService;
	
	public ProdutoController(ProdutoService produtoService) {
		
		this.produtoService = produtoService;
	}
	
	
	@GetMapping
	public List<Produto> buscarProdutos(
			@RequestParam int loja,
			@RequestParam int grupoInicial,
			@RequestParam int grupoFinal) {
		
		return this.produtoService.buscarProdutos(loja, grupoInicial, grupoFinal);
	}
	
	
	@GetMapping("/buscar")
	public List<Produto> buscarProduto(@RequestParam int loja, @RequestParam int codigo) {
		
		return this.produtoService.buscarProduto(loja, codigo);
	}
	
	

}
