package com.shoppingreal.simulacao_precificacao.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class Produto {

	private int codigo;
	private String descricao;
	private BigDecimal custo;
	private int estoque;
	private BigDecimal precoOriginal;
	private BigDecimal desconto = new BigDecimal("8.00");
	private BigDecimal margemBruta;
	private BigDecimal icms;
	private BigDecimal pisCofins;
	private BigDecimal csllIrpj;
	private BigDecimal operacional;
	private int grupo;

	public Produto(int codigo, String descricao, BigDecimal custo, int estoque, BigDecimal precoOriginal,
			BigDecimal desconto, BigDecimal margemBruta, BigDecimal icms, BigDecimal pisCofins, BigDecimal csllIrpj,
			BigDecimal operacional, int grupo) {

		this.codigo = codigo;
		this.descricao = descricao;
		this.custo = custo;
		this.estoque = estoque;
		this.precoOriginal = precoOriginal;
		this.desconto = desconto;
		this.margemBruta = margemBruta;
		this.icms = icms;
		this.pisCofins = pisCofins;
		this.csllIrpj = csllIrpj;
		this.operacional = operacional;
		this.grupo = grupo;

	}

	public int getCodigo() {
		return codigo;
	}

	public void setCodigo(int codigo) {
		this.codigo = codigo;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public int getGrupo() {
		return grupo;
	}

	public void setGrupo(int grupo) {
		this.grupo = grupo;
	}

	public int getEstoque() {

		return estoque;
	}

	public void setEstoque(int estoque) {

		this.estoque = estoque;
	}

	public BigDecimal getCusto() {
		return custo;
	}

	public void setCusto(BigDecimal custo) {
		this.custo = custo;
	}

	public BigDecimal getPrecoOriginal() {
		return precoOriginal;
	}

	public void setPrecoOriginal(BigDecimal precoOriginal) {
		this.precoOriginal = precoOriginal;
	}

	public BigDecimal getMargemBruta() {
		return margemBruta;
	}

	public void setMargemBruta(BigDecimal margemBruta) {
		this.margemBruta = margemBruta;
	}

	public BigDecimal getDesconto() {
		return desconto;
	}

	public void setDesconto(BigDecimal desconto) {
		this.desconto = desconto;
	}

	public BigDecimal getPrecoComDesconto() {

		return BigDecimal.valueOf(100).subtract(this.desconto).divide(BigDecimal.valueOf(100))
				.multiply(this.precoOriginal);

	}	
	

	public BigDecimal getIcms() {
		return icms;
	}

	public void setIcms(BigDecimal icms) {
		this.icms = icms;
	}

	public BigDecimal getPisCofins() {
		return this.pisCofins;
	}

	public void setPisCofins(BigDecimal pisCofins) {
		this.pisCofins = pisCofins;
	}

	public BigDecimal getCsllIrpj() {
		return csllIrpj;
	}

	public void setCsllIrpj(BigDecimal csllIrpj) {
		this.csllIrpj = csllIrpj;
	}

	public BigDecimal getOperacional() {
		return operacional;
	}

	public void setOperacional(BigDecimal operacional) {
		this.operacional = operacional;
	}
	
	
	private BigDecimal removerIcmsDaBaseCalculoPisCofins() {
		
		return  BigDecimal.valueOf(100).subtract(this.icms).divide(BigDecimal.valueOf(100))
				.multiply(this.pisCofins);
		
	}
	
	private BigDecimal percentualDespesas() {
		
		BigDecimal pisCofins = this.removerIcmsDaBaseCalculoPisCofins();

		return  this.getIcms().add(pisCofins).add(this.csllIrpj).add(this.getOperacional());
	}

	public BigDecimal getLucratividade() {		

		BigDecimal valorDespesas = this.percentualDespesas().divide(BigDecimal.valueOf(100))
				.multiply(this.getPrecoComDesconto());

		return this.getPrecoComDesconto().subtract(this.getCusto()).subtract(valorDespesas);

	}

	public BigDecimal getLucratividadePorcentagem() {
		return this.getLucratividade().divide(this.getPrecoComDesconto(), 4, RoundingMode.HALF_DOWN)
				.multiply(BigDecimal.valueOf(100));
	}

}
