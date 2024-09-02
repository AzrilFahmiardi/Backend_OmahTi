import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

var jokes = [];

app.use(bodyParser.urlencoded({ extended: true }));

//1. GET a random joke
app.get("/", (req, res) => {
  res.json(jokes[Math.floor(Math.random() * jokes.length)]);
});
//2. GET a specific joke
app.get("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundJoke = jokes.find((joke) => joke.id === id);
  res.json(foundJoke);
});

//3. GET a jokes by filtering on the joke type
app.get("/filter", (req, res) => {
  const type = req.query.type;
  const filteredActivities = jokes.filter((joke) => joke.jokeType === type);
  res.json(filteredActivities);
});

//4. POST a new joke
app.post("/jokes", (req, res) => {
  const newJoke = {
    id: jokes.length + 1,
    jokeText: req.body.text,
    jokeType: req.body.type,
  };

  jokes.push(newJoke);
  console.log(jokes.slice(-1));
  res.json(newJoke);
});

//5. PUT a joke
app.put("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const replacementJoke = {
    id: id,
    jokeText: req.body.text,
    jokeType: req.body.type,
  };

  const searchIndex = jokes.findIndex((joke) => joke.id === id);
  jokes[searchIndex] = replacementJoke;
  res.json(replacementJoke);
});

//6. PATCH a joke
app.patch("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const foundJoke = jokes.find((joke) => joke.id === id);
  const replacementJoke = {
    id: id,
    jokeText: req.body.text || foundJoke.jokeText,
    jokeType: req.body.type || foundJoke.jokeType,
  };
  const searchIndex = jokes.findIndex((joke) => joke.id === id);
  jokes[searchIndex] = replacementJoke;
  console.log(jokes[searchIndex]);
  res.json(replacementJoke);
});

//7. DELETE Specific joke
app.delete("/jokes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = jokes.findIndex((joke) => joke.id === id);
  if (searchIndex > -1) {
    jokes.splice(searchIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({
      error: `Joke with id: ${id} not found. No jokes were deleted`,
    });
  }
});

//8. DELETE All jokes
app.delete("/all", (req, res) => {
  const userKey = req.query.key;
  if (userKey === masterKey) {
    jokes = [];
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: `You are not authorised to perform this action` });
  }
});

app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
