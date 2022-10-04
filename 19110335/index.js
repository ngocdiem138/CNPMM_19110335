const app = require('./app');

const PORT = 5000;
const port = PORT;
app.listen(PORT, () => {
  console.log(`server started ${port}`);
});
