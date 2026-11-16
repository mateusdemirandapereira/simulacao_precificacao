package com.shoppingreal.simulacao_precificacao.repository;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.shoppingreal.simulacao_precificacao.model.Produto;
import java.math.BigDecimal;

@Repository
public class ProdutoRepository {
	
	
	private final JdbcTemplate jdbcTemplate;
	
	public ProdutoRepository(JdbcTemplate jdbcTemplate) {
		
		this.jdbcTemplate = jdbcTemplate;
	}
	
	public List<Produto> buscarProdutos(int loja, int grupoInicial, int grupoFinal) {
		
		String sql = "select\n"
				+ "	prd.no as codigo,\n"
				+ "    left(prd.name, length(prd.name) - 2) as descricao,\n"
				+ "    (prp.cost/10000) as custo,\n"
				+ "    (stk.qtty_varejo/1000) as estoque,\n"
				+ "    (prp.icm/100) as icms,\n"
				+ "    (prp.pis/100) + (prp.finsoc/100) as pisCofins,\n"
				+ "    (prp.adv/100) + (prp.adm/100) as csllIrpj,\n"
				+ "    (prp.refpdel2/100) as operacional,\n"
				+ "    (prp.profit/100) as margemBruta,\n"
				+ "    (prp.refprice/100) as precoOriginal,\n"
				+ "    prd.clno as grupo\n"
				+ "    from prd inner join prp on(prd.no = prp.prdno)\n"
				+ "		inner join stk on(prd.no = stk.prdno and prp.storeno = stk.storeno)\n"
				+ "        where prp.storeno = ? and stk.qtty_varejo > 0 and prd.clno between ? and ?; ";
		
		
		return this.jdbcTemplate.query(sql, (rs, rowNum) -> {
			
			Produto produto  = new Produto(
					Integer.parseInt(rs.getString("codigo").trim()),
					rs.getString("descricao"),
					rs.getBigDecimal("custo"),
					rs.getInt("estoque"),
					rs.getBigDecimal("precoOriginal"),
					new BigDecimal("8.00"),
					rs.getBigDecimal("margemBruta"),
					rs.getBigDecimal("icms"),
					rs.getBigDecimal("pisCofins"),
					rs.getBigDecimal("csllIrpj"),
					rs.getBigDecimal("operacional"),
					rs.getInt("grupo"));
			
			return produto;
			
		}, loja, grupoInicial, grupoFinal);
	}
	
	public List<Produto> buscarProduto(int loja, int codigo) {
		
		String sql = "select\n"
				+ "	prd.no as codigo,\n"
				+ "    left(prd.name, length(prd.name) - 2) as descricao,\n"
				+ "    (prp.cost/10000) as custo,\n"
				+ "    (prp.icm/100) as icms,\n"
				+ "    (prp.pis/100) + (prp.finsoc/100) as pisCofins,\n"
				+ "    (prp.adv/100) + (prp.adm/100) as csllIrpj,\n"
				+ "    (prp.refpdel2/100) as operacional,\n"
				+ "    (prp.profit/100) as margemBruta,\n"
				+ "    (prp.refprice/100) as precoOriginal,\n"
				+ "    (stk.qtty_varejo/1000) as estoque,\n"
				+ "    prd.clno as grupo\n"
				+ "    from prd inner join prp on(prd.no = prp.prdno)\n"
				+ "		inner join stk on(prd.no = stk.prdno and prp.storeno = stk.storeno)\n"
				+ "        where prp.storeno = ? and stk.qtty_varejo > 0 and prd.no = ?; "; 
		
		
		return this.jdbcTemplate.query(sql, (rs, rowNum) -> {
			
			Produto produto = new Produto(
					Integer.parseInt(rs.getString("codigo").trim()),
					rs.getString("descricao"),
					rs.getBigDecimal("custo"),
					rs.getInt("estoque"),
					rs.getBigDecimal("precoOriginal"),
					new BigDecimal("8.00"),
					rs.getBigDecimal("margemBruta"),
					rs.getBigDecimal("icms"),
					rs.getBigDecimal("pisCofins"),
					rs.getBigDecimal("csllIrpj"),
					rs.getBigDecimal("operacional"),
					rs.getInt("grupo"));
			
			return produto;
		}, loja, codigo);
	}

}
