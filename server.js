var express = require('express');

var app = express();

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use(express.static('./public'));

var port = process.env.PORT || 8000;
app.listen(port);
console.log('Application listening on port ' + port);