import app from "./app";
import "./passport";
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
