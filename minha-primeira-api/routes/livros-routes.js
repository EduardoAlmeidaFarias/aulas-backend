import Router from "express";
import {
  criarLivro,
  deletarLivro,
  devolverLivro,
  editarLivro,
  emprestarLivro,
  findAll,
  findOne,
} from "../controllers/livros-controller.js";

const router = Router();

router.get("/", (req, res) => {
  const todosOsLivros = findAll();
  res.json(todosOsLivros);
});
router.get("/:id", (req, res) => {
  const idLivro = parseInt(req.params.id);

  if (isNaN(idLivro)) {
    return res
      .status(400)
      .json({ mensagem: "identificador deve ser um numero" });
  }

  let livro = findOne(idLivro);

  if (!livro) {
    return res.status(404).send();
  }

  res.json(livro);
});

router.post("/", (req, res) => {
  let autor_enviado = req.body.dsAutor;
  let titulo_enviado = req.body.dsTitulo;

  if (!autor_enviado || !titulo_enviado) {
    return res
      .status(400)
      .json({ mensagem: "dados faltando, verifique autor e titulo" });
  }

  let livro_criado = criarLivro(titulo_enviado, autor_enviado);
  if (!livro_criado) {
    return res.status(500).json({ mensagem: "algo deu errado" });
  }

  return res.status(201).json(livro_criado);
});

router.delete("/:id", (req, res) => {
  const idLivro = parseInt(req.params.id);

  if (isNaN(idLivro)) {
    return res
      .status(400)
      .json({ mensagem: "identificador deve ser um numero" });
  }

  let livro = findOne(idLivro);
  if (!livro) {
    return res.status(404).send();
  }

  deletarLivro(idLivro);
  return res.status(204).send();
});

router.patch("/:id", (req, res) => {
  const idLivro = parseInt(req.params.id);

  if (isNaN(idLivro)) {
    return res
      .status(400)
      .json({ mensagem: "identificador deve ser um numero" });
  }

  const { dsTitulo, dsAutor, fgDisponivel } = req.body;

  if (dsTitulo === undefined && dsAutor === undefined && fgDisponivel === undefined) {
    return res
      .status(400)//id inválido ou nenhum campo enviado
      .json({ mensagem: "envie ao menos um campo para editar" });
  }

  const livroEditado = editarLivro(idLivro, { dsTitulo, dsAutor, fgDisponivel });

  if (!livroEditado) {
    return res.status(404).send();//livro não existe
  }

  return res.status(200).json(livroEditado);//editado com sucesso, retornando o livro atualizado
});

router.patch("/:id/emprestar", (req, res) => {
  const idLivro = parseInt(req.params.id);

  if (isNaN(idLivro)) {
    return res
      .status(400)//id não é número
      .json({ mensagem: "identificador deve ser um numero" });
  }

  const livro = findOne(idLivro);

  if (!livro) {
    return res.status(404).send();//livro não existe
  }

  if (!livro.fgDisponivel) {
    return res.status(409).json({ mensagem: "livro já está emprestado" });
  }

  const livroEmprestado = emprestarLivro(idLivro);
  return res.status(200).json(livroEmprestado);
});//emprestar um livro já emprestado, ou devolver um que já está disponível

router.patch("/:id/devolver", (req, res) => {
  const idLivro = parseInt(req.params.id);

  if (isNaN(idLivro)) {
    return res
      .status(400)
      .json({ mensagem: "identificador deve ser um numero" });
  }

  const livro = findOne(idLivro);

  if (!livro) {
    return res.status(404).send();
  }

  if (livro.fgDisponivel) {
    return res.status(409).json({ mensagem: "livro não está emprestado" });
  }

  const livroDevolvido = devolverLivro(idLivro);
  return res.status(200).json(livroDevolvido);
});//operação feita, retorna o livro atualizado

export default router;
