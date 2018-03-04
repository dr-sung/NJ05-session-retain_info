const express = require('express');
const session = require('express-session');
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(session({
	secret: 'mysecretekey',
	saveUninitialized: false,
	resave: false,
	cookie: {maxAge: 60*60*1000} // unit: ms, session expires in 1 hour
}));

// set ejs template engine
app.set('view engine', 'ejs');
// set folder location of ejs files
app.set('views', './ejs_views');

let error = {};

app.get('/', (req, res) => {
    const userinfo = req.session.userinfo;
    // 1st time request: userinfo is undefined
    res.render('index', {error, userinfo});
});

app.post('/', (req, res) => {
	let userinfo = {
		email: req.body.email,
		nodejs: req.body.nodejs,
	};

    // store submitted userinfo into the session
	req.session.userinfo = userinfo;

	error = {};
    errorFree = true;

	if (userinfo.email.indexOf('@') < 0) {
        error.email = '<font style="color: red;">@ is required</font>';
        userinfo.email = ''; // reset if invalid
		errorFree = false;
    }

	if (!userinfo.nodejs) {
		error.nodejs ='<font style="color: red;">You should know nodejs for this course</font>';
		errorFree = false;
    }

	if (errorFree) {
		res.send(JSON.stringify(userinfo));
	} else {
		res.redirect('/');
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running at port', port);
});