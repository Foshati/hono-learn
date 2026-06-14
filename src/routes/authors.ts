import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";

const app = new Hono();

type Author = { id: string; name: string; age: number | null };

const authors: Author[] = [
  { id: "1", name: "ali", age: 22 },
  { id: "2", name: "reza", age: 24 },
];

const createAuthorsSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number(),
});

const updateAuthorsSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.coerce.number().nullable().optional(),
});

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

app.post("/", sValidator("json", createAuthorsSchema), (c) => {
  const data = c.req.valid("json");
  const author = { id: crypto.randomUUID(), ...data };

  authors.push(author);

  return c.json(author, 201);
});

app.put("/:id", sValidator("json", updateAuthorsSchema), (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");

  const author = authors.find((a) => a.id === id);

  if (author == null) {
    return c.json({ error: "Author not found" }, 404);
  }
  if (data.name !== undefined) {
    author.name = data.name;
  }
  if (data.age !== undefined) {
    author.age = data.age;
  }

  return c.json(author, 201);
});

app.delete("/:id", (c) => {
  const id = c.req.param("id");
  const index = authors.findIndex((a) => a.id === id);

  if (index === -1) {
    return c.json({ error: "Author not found" }, 404);
  }

  authors.splice(index, 1);

  return c.json({ message: "Author deleted" });
  // return c.body(null,204)
});

export default app;
