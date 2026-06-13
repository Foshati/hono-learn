import { Hono } from "hono";

const app = new Hono();

const authors = [
  {
    id: "1",
    name: "ali",
    age: 22,
  },

  {
    id: "2",
    name: "reza",
    age: 24,
  },
];

app.get("/", (c) => {
  return c.json(authors);
});

app.get("/:id", (c) => {
  const id = c.req.param("id");
  const author = authors.find((a) => a.id === id);

  if (author == null) {
    return c.json({ error: "Author not found" }, 404);
  }

  return c.json(author);
});

export default app;
