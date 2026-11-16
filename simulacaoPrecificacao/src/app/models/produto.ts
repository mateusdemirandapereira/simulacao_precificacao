export interface Produto {
	
	codigo: number;
	descricao: string;
	grupo: number;
	estoque: number;
	custo: number;
	precoOriginal: number;
	margemBruta: number;
    desconto: number;
   	precoComDesconto: number;	
	novoPreco: number;
	varPreco: number;
	novaMargemBruta: number;
	varMargemBruta: number;
	novoDesconto: number;
	novoPrecoComDesconto: number;
	varPrecoComDesconto: number;
	varMargemReal: number;
	icms: number;
	pisCofins: number;
	csllIrpj: number;
	operacional: number;	
	novoOperacional: number;	
	lucratividade: number;
	novaLucratividadePorcentagem:number;
	novaLucratividade: number;
	lucratividadePorcentagem: number;	
		
}
