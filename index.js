// Importa o express
const express = require('express');

// Disponjibiliza o express na aplicação
const server = express();

// Permite que o express trabalhe com json
server.use(express.json());

// Cria o número de requisições da aplicação;
// Foi criada como let porque sofrerá mutações;
let numberOfRequests = 0;

// Cria o array de projetos
const projects = [
  {
    id: 1,
    title: 'Projeto 1',
    tasks: []
  }
];

// Cria o middleware global
server.use((req, res, next) => {
  console.time('Request');
  next();
});

// Middleware que checa se projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found'});
  }

  return next();
};

// Middleware que dá log do quantitativo de requisições
function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
};

server.use(logRequests);

// Cria as rotas da aplicação
// Rota index
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Rota create
server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  const project = {
    id: id,
    title: title,
    tasks: tasks
  }

  projects.push(project);

  return res.json(projects);
});

// Rota Atualizar
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  
  project.title = title;

  return res.json(project);
})

// Rota Deletar
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// Rota criar tarefa
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  
  return res.json(project);
});

server.listen(3000);