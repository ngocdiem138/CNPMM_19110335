const {
  index,
  addBlog,
  getBlog,
  addComment,
  updateBlog,
  getBlogUpdate,
  removeBlog,
} = require('../controller');

const router = (app) => {
  app.get('/', index);
  app.get('/blog/:id', getBlog);
  app.post('/add', addBlog);
  app.get('/update/:id', getBlogUpdate);
  app.post('/update/:id', updateBlog);
  app.post('/blog/:id', addComment);
  app.get('/delete/:id', removeBlog);
};

module.exports = router;
