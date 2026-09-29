import express from "express";

function validaParametro(parametro_a_ser_validado) {
  console.log(parametro_a_ser_validado);
  const numero = parseInt(parametro_a_ser_validado);
  let retorno = isNaN(numero);
  console.log(retorno);
}

const app = express(); //primeiro pilar: instancia do express
app.use(express.json());
/**
 * idLivro -> identificador / int
 * dsTitulo -> string
 * dsAutor -> string
 * fgDisponivel -> boolean
 */
let ultimo_id = 1;
let livros = [
  {
    idLivro: 1,
    dsTitulo: "as cronicas de narnia",
    dsAutor: "C S Lewis",
    fgDisponivel: true,
  },
]; //banco de dados

app.get("/", function (req, res) {
  res.send("seja bem vindo à gestao de livros");
});

app.get("/livros", function (req, res) {
  res.json(livros);
});

app.get("/livros/:id", (req, res) => {
  const id = req.params.id;

  if (validaParametro(id)) {
    //se nao for um numero
    return res
      .status(400) //requisicao mal formada
      .json({ mensagem: "o parametro precisa ser um numero valido" });
  }

  let livro = livros.find((livro) => {
    return livro.idLivro === id;
  });

  if (livro === undefined) {
    return res.status(404).send();
  }

  res.json(livro);
});

app.post("/livros", (req, res) => {
  let autor_enviado = req.body.dsAutor;
  let titulo_enviado = req.body.dsTitulo;

  if (!autor_enviado || !titulo_enviado) {
    return res
      .status(400)
      .json({ mensagem: "dados faltando, verifique autor e titulo" });
  }

  let id_novo = ultimo_id + 1;
  ultimo_id++;

  let novo_livro = {
    idLivro: id_novo,
    fgDisponivel: true,
    dsTitulo: titulo_enviado,
    dsAutor: autor_enviado,
  };

  livros.push(novo_livro); //eu adicionei um novo livro ao " banco de dados"

  res.status(201).json(novo_livro);
});

app.delete("/livros/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ mensagem: "identificador deve ser um numero" });
  }

  let index_livro = livros.findIndex((livro) => {
    return livro.idLivro === id;
  });

  if (index_livro === -1) {
    return res.status(404).send();
  }

  livros.splice(index_livro, 1);

  res.sendStatus(204);
});

app.patch("/livros/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const novo_titulo = req.body.dsTitulo;
  const novo_autor = req.body.dsAutor;

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ mensagem: "identificador precisa ser um numero valido" });
  }

  let index_livro = livros.findIndex((livro) => {
    return livro.idLivro === id;
  });

  if (index_livro === -1) {
    return res.sendStatus(404);
  }

  let livro_a_ser_atualizado = livros[index_livro];

  if (novo_autor !== undefined) {
    livro_a_ser_atualizado.dsAutor = novo_autor;
  }

  if (novo_titulo !== undefined) {
    livro_a_ser_atualizado.dsTitulo = novo_titulo;
  }
});

app.listen(3000); //terceiro pilar: porta a ser ouvida

/*

devolver livro
  PUT/PATCH

*/
