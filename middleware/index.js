const isSession = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    next();
  }
}

const isNotSession = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  } else {
    next();
  }
}

const isNotSessionIndex = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login');
  } else {
    next();
  }
}

module.exports = { isSession, isNotSession, isNotSessionIndex};
