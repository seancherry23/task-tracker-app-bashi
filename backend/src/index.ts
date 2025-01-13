import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 8000;

type RouteHandler = (req: express.Request, res: express.Response) => void;

// add JSON parsing middleware
app.use(express.json());

// initialize our tasks, which are an array of objects
const tasks: { id: string, name: string, description: string }[] = [];

// GET /
app.get('/', ((req, res) => {
  res.send('Server is up and running!');
}) as RouteHandler);

// GET /tasks route to get all tasks
app.get('/tasks', ((req, res) => {
  res.json(tasks);
}) as RouteHandler);

// POST /tasks route to add new tasks
app.post('/tasks', ((req, res) => {
  const { name, description } = req.body;
  
  // make sure new tasks have a name and description
  if (!name || !description) {
    return res.status(400).json({ message: 'Task name and description are required.'})
  }
  
  // create a new task
  const newTask = {
    id: uuidv4(),
    name,
    description,
  };
  
  // add new task object to tasks array
  tasks.push(newTask);
  
  // send response with new task
  res.status(201).json(newTask);
})as RouteHandler);

// DELETE /tasks/:id to delete a task by id
app.delete('/tasks/:id', ((req, res) => {
  const { id } = req.params;

  // find index of task with requested id
  const taskIndex = tasks.findIndex(task => task.id === id);

  // check if task with requested id is in tasks array
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // remove task from tasks array
  tasks.splice(taskIndex, 1);

  // send success response
  res.status(200).json({ message: `Task ${id} deleted`})
}) as RouteHandler)

// setup server to listen on Port 8000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});