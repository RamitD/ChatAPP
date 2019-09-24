const service = require('../service/userService');
const tokenAuth = require('../middleware/token');

exports.addUser = (req, res) => {
    req.checkBody('email').isEmail();
    req.checkBody('password').isLength({ min: 5 })
    req.getValidationResult()
        .then(err => {
            if (err.isEmpty()) {
                service.addingUser(req, (err, data) => {
                    if (err) {
                        res.status(err.status).send(err.message)
                    }
                    if (data) {
                        res.json({
                            message: data
                        });
                    }
                });
            }
            else {
                res.status(422).json({
                    error: "efrw " + err
                });
            }
        }) // 
}
exports.loginUser = (req, res) => {
    req.checkBody('email').isEmail();
    req.checkBody('password').isLength({ min: 5 })
    req.getValidationResult().then(err => {
        if (err.isEmpty) {
            service.login(req, (err, data) => {
                if (err) {
                    return res.status(err.status).send(err.message);
                }
                if (data) {
                    const token = data.token;
                    res.header("Authorization", token)
                    return res.status(200).json({
                        info: data
                    });
                }
            })
        }
        else {
            return res.status(err.status).send(err.message);
        }
    })
}

exports.resetpass = (req, res) => {
    req.checkBody('email').isEmail();
    req.checkBody('newpassword').isLength({ min: 5 })
    req.getValidationResult().then(err => {
        if (err.isEmpty) {
            var token = req.header("Authorization");
            var check = tokenAuth.verifyToken(token);
            if (check != null) {
                service.resetPass(req, (err, data) => {
                    if (err) {
                        return res.json({
                            message: err.message
                        });
                    }
                    if (data) {
                        return res.json({
                            message: data
                        });
                    }
                })
            }
            else {
                res.json({
                    message: "Invalid Token"
                });
            }
        }
    })
}

exports.forgotpass = (req, res) => { //
    req.checkBody('email').isEmail();
    req.getValidationResult().then(err => {
        if (err.isEmpty) {
            service.forgotPass(req, (err, data) => {
                if (err) {
                    console.log("hgdsfa");
                    return res.send(err.message);
                }
                if (data) {
                    console.log("dufyhuf");
                    return res.status(200).json({
                        message: data
                    });
                }
            });
        }
    });
}