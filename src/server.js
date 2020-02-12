const express = require("express");

// substitui o id incremental por uuid para que seja possível gerar id's dinâmicos
const uuid = require("uuid/v4");

const server = express();

server.use(express.json());

let projects = [
	{
		id: uuid(),
		title: "Default",
		tasks: ["Criar um novo projeto"]
	}
];

let count = 0;

// Request count
server.use((req, res, next) => {
	count++;
	console.log(`Requisições recebidas: ${count}`);
	next();
});

// Middlewares
function checkProjectExists(req, res, next) {
	const { id } = req.params;
	const project = projects.filter(project => project.id === id);

	console.log(project);
	if (project.length === 0) {
		return res.status(400).json({
			error: "Não foi possível encontrar um projeto com este id"
		});
	}

	return next();
}

// Rota inicial
server.get("/", (req, res) =>
	res.json("Primeiro desafio rocketseat gostack bootcamp 10")
);

// Listar projetos
server.get("/projects", (req, res) => res.json(projects));

// Criar novo projeto
server.post("/projects", (req, res) => {
	projects = [...projects, { ...req.body, id: uuid() }];
	res.json(projects);
});

// Editar projeto
server.put("/projects/:id", checkProjectExists, (req, res) => {
	const { id } = req.params;

	projects = projects.map(project =>
		project.id !== id ? project : { ...project, ...req.body }
	);

	return res.json(projects);
});

// Excluir projeto
server.delete("/projects/:id", checkProjectExists, (req, res) => {
	const { id } = req.params;
	projects = projects.filter(project => project.id !== id);
	res.send();
});

// Criar tarefa
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
	const { id } = req.params;
	const { title } = req.body;

	projects = projects.map(project =>
		project.id !== id
			? project
			: { ...project, tasks: [...project.tasks, { id: uuid(), title }] }
	);

	return res.json(projects);
});

server.listen(3333);
