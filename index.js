const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: "Invalid id" });
  }

  return next();
}

function countReq(req, res, next) {
  console.count("Request count: ");
  return next();
}

server.post("/projects", countReq, (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

server.get("/projects", countReq, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, countReq, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  let project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIdExists, countReq, (req, res) => {
  const { id } = req.params;
  let project = projects.find(p => p.id === id);

  projects.splice(projects.indexOf(project), 1);
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkIdExists, countReq, (req, res) => {
  const title = req.body.title;
  const { id } = req.params;
  let project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
