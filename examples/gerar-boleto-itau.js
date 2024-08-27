const config = require('../config/config.json')
const Gerador = require('../index');
const fs = require('fs');


const init = () => {
  const boleto = createBoleto();

  //const dir = '../temp'
  const dir = config.dir;

  if (fs.existsSync(dir)){
    const writeStream = fs.createWriteStream(config.dir + 'boletos/' + config.numero_doc + '.pdf');
    
    new Gerador.boleto.Gerador(boleto).gerarPDF({
      creditos: '',
      stream: writeStream
    }, (err, pdf) => {
      if (err) return console.error(err);
      
      writeStream.on('finish', () => {
        console.log('Arquivo criado em ' + config.dir + 'boletos');
      });
    });
  }
}

const createBoleto = () => {
  const Datas = Gerador.boleto.Datas;
  const bancos = Gerador.boleto.bancos;
  const pagador = createPagador();
  const beneficiario = createBeneficiario();
  const instrucoes = createInstrucoes();

  return Gerador.boleto.Boleto.novoBoleto()
    .comLocaisDePagamento(['EM QUALQUER BANCO OU CORRESP. NAO BANCARIO'])
    .comDatas(Datas.novasDatas()
      .comVencimento(config.dia_vencimento, config.mes_vencimento, config.ano_vencimento)
      .comProcessamento(config.dia_processamento, config.mes_processamento, config.ano_processamento)
      .comDocumento(config.dia_documento, config.mes_documento, config.ano_documento))
    .comBeneficiario(beneficiario)
    .comPagador(pagador)
    .comBanco(new bancos.Itau())
    .comValorBoleto(config.valor) //Apenas duas casas decimais
    .comNumeroDoDocumento(config.numero_doc)
    .comEspecieDocumento('DMI') //Duplicata de Venda Mercantil
    .comInstrucoes(instrucoes);
}

const createPagador = () => {
  const enderecoPagador = Gerador.boleto.Endereco.novoEndereco()
    .comLogradouro(config.log_pagador)
    .comBairro(config.bairro_pagador)
    .comCidade(config.cid_pagador)
    .comUf(config.uf_pagador)
    .comCep(config.cep_pagador)

  return Gerador.boleto.Pagador.novoPagador()
    .comNome(config.nome_pagador)
    .comRegistroNacional(config.cpf_cnpj_pagador)
    .comEndereco(enderecoPagador)
}

const createBeneficiario = () => {
  const enderecoBeneficiario = Gerador.boleto.Endereco.novoEndereco()
    .comLogradouro(config.log_beneficiario)
    .comBairro(config.bairro_beneficiario)
    .comCidade(config.cid_beneficiario)
    .comUf(config.uf_beneficiario)
    .comCep(config.cep_beneficiario)

  return Gerador.boleto.Beneficiario.novoBeneficiario()
    .comNome(config.nome_beneficiario)
    .comRegistroNacional(config.cnpj_beneficiario)
    .comCarteira(config.carteira)
    .comAgencia(config.agencia)
    // .comDigitoAgencia('5')
    .comCodigoBeneficiario(config.codigo_cc)
    .comDigitoCodigoBeneficiario(config.digito_cc)
    .comNossoNumero(config.nosso_numero)
    .comDigitoNossoNumero(config.d_nosso_numero)
    .comEndereco(enderecoBeneficiario);
}

const createInstrucoes = () => {
  const instrucoes = config.instrucoes;
  return instrucoes;
}

init();
