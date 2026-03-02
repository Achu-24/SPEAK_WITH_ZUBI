import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let stage = 0;

app.post("/chat", (req, res) => {
  const { message } = req.body;
  let reply = "";

  switch (stage) {
    case 0:
      reply = `Wow! ${message} sounds delicious! Do you like it in a cone or a cup?`;
      stage = 1;
      break;

    case 1:
      reply = `Nice choice! ${message} is awesome! Do you want sprinkles or chocolate syrup on top?`;
      stage = 2;
      break;

    case 2:
      reply = `Yummm! ${message} makes it extra tasty! What color is your dream ice cream shop?`;
      stage = 3;
      break;

    case 3:
      reply = `Oooh, a ${message} ice cream shop sounds magical! Would you share your ice cream with a friend?`;
      stage = 4;
      break;

    case 4:
      reply = `That’s so sweet! What would you name your ice cream shop?`;
      stage = 5;
      break;

    case 5:
      reply = `I love that name! Your shop would be the best ever! Want to build another ice cream together?`;
      stage = 0;
      break;

    default:
      reply = `Let’s start again! Which flavor do you choose this time?`;
      stage = 0;
  }

  res.json({ reply });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});