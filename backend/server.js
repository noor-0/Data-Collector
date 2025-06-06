const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const app = jsonServer.create();
const router = jsonServer.router('db.json');

app.db = router.db;

app.use(cors());
app.use(jsonServer.defaults());
app.use(auth);        // <--- Enable login/register routes
app.use(router);      // <--- Attach your db.json routes

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 JSON Server + Auth running on http://localhost:${PORT}`);
});
