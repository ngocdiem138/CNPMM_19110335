let { blogs } = require('../models/index');

const comments = new Map();
comments.set('1', [{ name: 'Diem', comment: 'Thêm comment ở dưới nha' }]);
function generateUUID() { // Public Domain/MIT
  let d = new Date().getTime();// Timestamp
  let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;// Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;// random number between 0 and 16
    if (d > 0) { // Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else { // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const index = (req, res, next) => {
  res.render('index', { blogs });
};

const addBlog = (req, res, next) => {
  const { body } = req;
  blogs.push({ id: generateUUID(), ...body });
  comments.set(generateUUID().toString(), []);
  res.redirect('/');
};

const getBlog = (req, res, next) => {
  const { id } = req.params;
  const blog = blogs.find((b) => b.id.toString() === id.toString());
  const comment = comments.get(id.toString());
  res.render('blog', { blog, comment });
};

const getBlogUpdate = (req, res, next) => {
  const { id } = req.params;
  const blog = blogs.find((b) => b.id.toString() === id.toString());
  const comment = comments.get(id.toString());
  res.render('update', { blog });
};

const addComment = (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  if (!body.name && !body.comment) res.redirect(`/blog/${id}`);
  if (!comments.has(id.toString())) comments.set(id.toString(), []);
  const oldComment = comments.get(id.toString());
  oldComment.push({ ...body });
  comments.set(id.toString(), oldComment);
  const blog = blogs.find((b) => b.id.toString() === id.toString());
  const comment = comments.get(id.toString());
  res.redirect(`/blog/${id}`);
};

const updateBlog = (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const newBlog = { id, ...body };
  blogs = blogs.map((b) => (b.id.toString() === id.toString() ? newBlog : b));
  res.redirect(`/blog/${id}`);
};

const removeBlog = (req, res, next) => {
  const { id } = req.params;
  blogs = blogs.filter((b) => (b.id.toString() !== id.toString()));
  res.redirect('/');
};

module.exports = {
  index,
  addBlog,
  getBlog,
  addComment,
  removeBlog,
  updateBlog,
  getBlogUpdate,
};
