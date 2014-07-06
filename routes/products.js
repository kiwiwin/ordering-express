var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res) {
  res.statusCode = 200;
  res.send()
});

module.exports = router;
