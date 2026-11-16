package com.shoppingreal.simulacao_precificacao.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shoppingreal.simulacao_precificacao.model.Produto;
import com.shoppingreal.simulacao_precificacao.repository.ProdutoRepository;


@Service
public class ProdutoService {
	
	
	private final ProdutoRepository produtoRepository;
	
	public ProdutoService(ProdutoRepository produtoRepository) {
		
		this.produtoRepository = produtoRepository;
	}
	
	
	public List<Produto> buscarProdutos(int loja, int grupoInicial, int grupoFinal) {
		
		return this.produtoRepository.buscarProdutos(loja, grupoInicial, grupoFinal);
	}
	
	
	public List<Produto> buscarProduto(int loja, int codigo) {
		
		return this.produtoRepository.buscarProduto(loja, codigo);
	}

}
