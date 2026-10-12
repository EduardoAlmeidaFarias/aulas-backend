import express from "express";
import livrosRouter from "./routes/livros-routes.js";

const app = express();//cria o servidor
app.use(express.json());//permite receber dados em formato JSON

app.use((req, res, next) => {//middleware global de log
  const { method, originalUrl, ip } = req;
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - IP: ${ip}`);
  next(); //sem isso a requisição trava aqui
});

app.use("/livros", livrosRouter);//conecta as rotas de livros ao endereço /livros

app.listen(3000);//inicia o servidor na porta 3000.
