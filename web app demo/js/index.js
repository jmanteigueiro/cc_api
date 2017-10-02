const express        = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const port = 8080;


require('./routes')(app, {});

app.use('/',express.static(path.join(__dirname,"../pages")));

app.listen(port, () => {
	 console.log("App online at port " + port);

	 console.log(path.join(__dirname,"../pages"))
});
