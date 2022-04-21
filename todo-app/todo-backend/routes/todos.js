const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { setAsync, getAsync } = require('../redis');


/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const todos = await getAsync('added_todos');
	await setAsync('added_todos', Number(todos) +1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  
  let newDone 
  if (req.todo.done == false){
    newDone = true
  };
  if (req.todo.done == true){
    newDone = false
  };

  const id = req.todo.id
  const text = req.todo.text
  const done = newDone
  const newTodo = 
  { 
    id,
    text,
    done
  }
  res.send(newTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
