# XFragil-EC-BCC

## Integrantes da Equipe: Allan Takeshi, Guilherme Kavalco, Heitor dos Santos, Thiago Muraro.
Esse projeto foi proposto na matéria de Experiência Criativa 
pelos professores Andrey Cabral Meira e Roberto Hirochi Herai.

##----------------------------------------------------------------------------------------------

## QUANTO AO PROJETO:

## O projeto que visa a criação de uma ferramenta que indicará ao profissional da saúde se o paciente 
## deve ou não fazer o exame para confirmar se possuí a Síndrome do X Frágil. 
## A consulta ocorrerá normalmente com o paciente. Após o término da consulta, antes do paciente sair do 
## consultório, o profissional deverá acessar a ferramenta on-line e preencher o formulário fornecido 
## para que retorne o resultado:

## O paciente deve fazer o exame | O paciente não deve fazer o exame

## Após o preenchimento do formulário, resposta obtida do formulário e o paciente estar ciente sobre 
## dever ou não fazer o exame, o relatório da consulta será armazenada em um Banco de Dados para que:
## * Sirva como material para aprofundar os estudos quanto a Síndrome do X Frágil
## * Caso seja necessário, revisitar alguma consulta específica
## * Realizar o acompanhamento ao longo do tempo do paciente

##----------------------------------------------------------------------------------------------

## QUANTO AOS USUÁRIOS DO PROJETO:

## O projeto haverá somente dois tipos de usuários, sendo eles:
## * ADMIN
## * PROFISSIONAL DA SAÚDE


##----------------------------------------------------------------------------------------------

## QUANTO AO FUNCIONAMENTO DO PROJETO:

## O projeto haverá um ADMIN inicial cadastrado que será o responsável por cadastrar os demais
## ADMINs e terá o controle sob os demais aspectos da ferramenta, podendo editar/adicionar/remover
## PROFISSIONAIS DA SAÚDE / ADMINs / relatórios constados no Banco de Dados.

## Os PROFISSIONAIS DA SAÚDE devem se cadastrar no sistema a partir da aplicação WEB, onde ocorrerá
## uma verificação para impedir que pessoas não permitidas e/ou irregulares tenham acesso à ferramenta.
## A ferramenta consiste em abas com diferentes funções, sendo elas:
## * Cadastro de Usuário
## * Login de Usuário
## * Perfil de Usuário
## * Cadastro de Paciente
## * Relatórios de Pacientes
## Dependendo do seu tipo de usuário, as permissões e visualizações da ferramenta mudam. Por exemplo,
## caso o usuário seja do tipo PROFISSIONAL DA SAÚDE, ele só terá acesso aos relatórios que ele é
## responsável. Caso o usuário seja do tipo ADMIN, ele terá acesso à todos os relatórios de todos
## os pacientes de todos os PROFISSIONAIS DA SAÚDE.

## A ferramente consiste em um formulário de 12 perguntas de modelo objetivo, os quais o PROFISSIONAL
## DA SAÚDE marcará as opções conforme as analises feitas durante a consulta com o paciente. Esse 
## formulário retornará uma pontuação que dirá se o paciente deve ou não realizar o exame para confirmar
## a Síndrome do X Frágil. O formulário foi criado com base em estudos avançados sobre essa síndrome, que
## foi capaz de gerar 12 perguntas que, quando respondidas, retornam uma pontuação dependendo do sexo. Essas
## perguntas envolvem aspectos físicos e comportamentais do paciente.

## Após a consulta e a consolidação do relatório (formulário + análises do PROFISSIONAL DA SAÚDE), o relatório
## é enviado ao Banco de Dados, onde poderá servir como material de estudos e histórico de pacientes.



