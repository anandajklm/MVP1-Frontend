/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/


const getList = async () => {
    let url = 'http://192.168.0.7:5000/cadastros';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        data.registros.forEach(item => insertList(item.classificacao, item.valor, item.data_cadastro))
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getList()

  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (classificacao, valor, data_cadastro) => {
    const formData = new FormData();
    formData.append('classificacao', classificacao);
    formData.append('valor', valor);
    formData.append('data_cadastro', data_cadastro);
  
    let url = 'http://192.168.0.7:5000/cadastro';
    fetch(url, {
      method: 'post',
      body: formData
    })      
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  

  
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        let id = div.id.split("-").slice(-1).toString(); 
        row_detalhe = document.getElementById("row-cadastro-detalhe-".concat(id)) 
        row_detalhe.remove()

        const titulo = div.getElementsByTagName('td')[0].innerHTML
        const data_registro = div.getElementsByTagName('td')[1].innerHTML

        if (confirm("Você tem certeza?")) {
          div.remove()
          document.fin
          deleteItem(classificacao, data_cadastro)
          alert("Removido!")
        }
      }
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um item da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItem = (classificacao, data_cadastro) => {
    let url = 'http://192.168.0.7:5000/cadastro?'.concat("classificacao=", classificacao, "&", "data_cadastro=", data_cadastro);
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo item com nome, quantidade e valor 
    --------------------------------------------------------------------------------------
  */
  const newItem = () => {
    let classificacao = document.getElementById("newClassificacao").value;
    let valor = document.getElementById("newValor").value;
    let data_cadastro = document.getElementById("newDataCadastro").value;
    
    if (data_cadastro.length === 0){ // inputs com data vazia
      date_aux = new Date()
      data_cadastro = [date_aux.getDate().toString().padStart(2, '0'), date_aux.getMonth().toString().padStart(2, '0'), date_aux.getFullYear()].join('/')
    }

    /* validações da data */

    insert_data = true

    try {
      const regex = /\d{2}\/\d{2}\/\d{4}/g
      if(RegExp(regex).test(data_cadastro)){
        var partes_data = data_cadastro.split("/").map(item => parseInt(item))
                
        data_aux = new Date(partes_data[2], partes_data[1], partes_data[0] )
        data_comp = [data_aux.getDate().toString().padStart(2, '0'), data_aux.getMonth().toString().padStart(2, '0'), data_aux.getFullYear()].join('/')

        if (data_cadastro !== data_comp)
          throw "Data inválida!"

        if (data_aux > new Date())
          throw "Data inválida, pois está no futuro!"

      }
      else
        throw "Data em formato inválido! Formato esperado: dd/mm/yyyy" 
      
    }catch(e){
      insert_data = false
      alert(e)
    }
    


    if (insert_data){
      postItem(classificacao, valor, data_cadastro)
      insertList(classificacao, valor, data_cadastro)
      alert("Item adicionado!")
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertList = (classificacao, valor, data_Cadastro) => {
    var item_resumo = [classificacao, data_Cadastro]
    var item_detalhe = [valor]

    var table = document.getElementById('tabela-experiencias');
    var id = Date.now().toString(36) + Math.random().toString(36).substr(2); // id único para construir as rows

    /* Definição dos ids das rows */ 

    const class_name = "row-experiencia"

    var classe_resumo = class_name.concat("-resumo")
    var id_resumo = classe_resumo.concat("-", id)

    var classe_detalhe = class_name.concat("-detalhe")
    var id_detalhe = classe_detalhe.concat("-", id)

    /* Adiciona row de resumo e suas propriedades */
    
    var row_resumo = table.insertRow();
    row_resumo.className = class_name
    row_resumo.id = id_resumo

    for (var i = 0; i < item_resumo.length; i++) {
      var cel = row_resumo.insertCell(i);
      cel.textContent = item_resumo[i];
      cel.setAttribute("onclick", "toggleRowVisibility".concat("('", id_detalhe, "')"))
    } 

    insertButton(row_resumo.insertCell(-1))
    removeElement()

    //row_resumo.setAttribute("onclick", "toggleRowVisibility".concat("('", id_detalhe, "')"))
    row_resumo.className = classe_resumo

    /* ------ fim da row de resumo ------  */

    /* Adiciona row de detalhe e suas propriedades */
        
    var row_detalhe = table.insertRow();
    row_detalhe.className = class_name
    row_detalhe.id = id_detalhe

    for (var i = 0; i < item_detalhe.length; i++) {

      var cel = row_detalhe.insertCell(i);
      cel.textContent = item_detalhe[i];
      cel.setAttribute("colspan", "3");

      //cel_detalhe.setAttribute("colspan", "2")
    }

    row_detalhe.className = classe_detalhe
    row_detalhe.style.display = 'none';


    /*
    row_detalhe.style.display == ''
    row_detalhe.setAttribute("colspan", "2")
    */
    /* ------ fim da row de detalhe ------  */

    
    document.getElementById("newValor").value = "";
    document.getElementById("newClassificacao").value = "";
    document.getElementById("newDataCadastro").value = "";
  
    
  }


    