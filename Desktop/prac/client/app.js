
var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/signup", { templateUrl: "/store/signup.html" })
        .when("/login", { templateUrl: "/store/login.html" })
        .when("/forgotPassword", { templateUrl: "/store/forgotpassword.html" })
        .when("/resetPassword", { templateUrl: "/store/resetpass.html" })
        .when("/setPassword", { templateUrl: "/store/setpassword.html" })
        .when("/chatwindow", { templateUrl: "/store/chatwindow.html" })
});
var sender="";
var reciever="";
app.controller("MyCtrl", myCtrl);
function myCtrl($location, $http, $scope) {
    var socket = io.connect('http://localhost:8000/#!/');
    // this.email="email";
    // this.password="password";
    
    // $scope.sender="";
    this.output = "";
    this.data = {};
    this.dataL = {};
    this.dataF = {};
    this.dataR = {};
    $scope.name = "DSAF";
    $scope.nameList = [];
    $scope.chat="";
    // this.sender = "";
    // $scope.sender="AAA";
    // $scope.reciever = "";
    $scope.message = "";
    $scope.chatRoom = [];
    // $scope.chatH = new Array(20);
    this.clickSignup = function () {
        $location.path("/signup");
    }
    this.clickLogin = function () {
        $location.path("/login");
    }
    this.clickResetPassword = function () {
        $location.path("/resetPassword");
    }
    this.clickForgotPassword = function () {
        $location.path("/forgotPassword");
    }
    this.addUser = function (name, email, password) {
        this.data = {
            name: name,
            email: email,
            password: password
        }
        $http({
            url: "http://localhost:8000/user/signup",
            method: "POST",
            data: this.data
        }).then(response => {
            if (response) {
                this.output = "User Adder";
            }
        })
            .catch(err => {
                if (err) {
                    this.output = "Unable to add user";
                }
            })
    }
    this.userLogin = function (email, password) {


        this.name = "NAME";
        this.dataL = {
            email: email,
            password: password,
            token: ""
        }
        this.outputL = "Unable to Login";
        $http({
            method: "POST",
            url: "http://localhost:8000/user/login",
            data: this.dataL
        })
            .then(response => {
                if (response) {
                    $http.defaults.headers.common['Authorization'] = response.data.info.token;
                    // $scope.$apply(() => {
                    //     $scope.sender=response.data.info.name ;
                    // })
                    // $scope.sender=response.data.info.name ;
                    // this.sender = response.data.info.name;
                    sender=response.data.info.name;
                    console.log(sender + " NAME of Sender")
                    this.outputL = "User Logged In";
                    $location.path("/chatwindow");
                }
            }).catch(err => {
                if (err) {
                    this.outputL = err.message+"Unable to Login!!!";
                }
            })
    }

    $http({
        method: "GET",
        url: "http://localhost:8000/user/getData",
        data: this.dataL
    })
        .then(response => {
            if (response) {
                console.log("hello ")
                console.log(response.data.message)
                $scope.nameList = response.data.message;
            }
        })
        .catch(err => {
            if (err) {
                this.outputL = "Unable to Process!!!";
            }
        })


    this.forgotPassword = function (email) {
        this.dataF = {
            email: email
        }
        $http({
            method: "POST",
            url: "http://localhost:8000/user/forgotpass",
            data: this.dataF
        })
            .then(response => {
                if (response) {
                    this.outputF = "Mail Sent";
                } message
            }).catch(err => {
                if (err) {
                    this.outputF = response.data;
                }
            });
    }

    this.resetPassword = function (email, newpassword) {
        this.dataR = {
            email: email,
            newpassword: newpassword
        }
        $http({
            method: "PATCH",
            url: "http://localhost:8000/user/resetpass",
            data: this.dataR
        })
            .then(response => {
                if (response) {
                    this.outputR = response.data;
                }
            }).catch(err => {
                if (err) {
                    this.outputR = response.data;
                }
            })
    }


    this.setToken = function (gToken, email) {
        this.dataS = {
            email: email
        }
        this.outputS = "Unable to Change Password";
        $http({
            method: "POST",
            url: "http://localhost:8000/user/setpass",
            data: this.dataS
        })
            .then(response => {
                if (response.data.message === "okay token recieved") {
                    $http.defaults.headers.common['Authorization'] = gToken;
                    this.outputS = "Click on Reset Password";
                }
                else if (response.data.message === "error occured") {
                    this.outputS = "error occured";
                }
            }).catch(err => {
                if (err) {
                    this.outputS = "error occured";
                }
            })
    }
    var output = document.getElementById('ot');
    $scope.send = function (message, handle) {

        socket.emit('chat', {
            message: message,
            handle: handle
        });
    }

    socket.on('chat-send', function (data) {
        output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    });
    
    $scope.setChatroom = function (_reciever) {
        reciever = _reciever;
        var chatData = {
            sender: sender,
            reciever: reciever,
            message: $scope.message
        }
        
        console.log("Sender : " + sender + " Reciever : " + reciever);
        $http({
            method: "POST",
            url: "http://localhost:8000/user/storeMessage",
            data: chatData
        }).then(response => {
            $scope.chatRoom = response.data.info;
            // $scope.$apply(()=>{
            //     $scope.chatRoom=response.data.info;
            // })
        })
            .catch(err => {
                console.log(err.message);
            })
        // $scope.message = "";
    }
    $scope.sendMessage=function(_message){
        $scope.message=_message;
        var chatData = {
            sender: sender,
            reciever: reciever,
            message: $scope.message
        }
        $http({
            method: "POST",
            url: "http://localhost:8000/user/storeMessage",
            data: chatData
        })
        .then(response=>{
            $scope.chatRoom = response.data.info;
        })
        .catch(err=>{
            console.log(err.message);
        })
    }
}

//     $scope.sendMessage = function (message, handle) {
//         // var output = document.getElementById('output');
//         console.log(message + " " + handle);
//         socket.emit('chat', {
//             message: message,
//             handle: handle
//         });
//         message="";

//         socket.on('chat-send', function (data) {
//             // output.innerHTML+= '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
//             // $scope.$apply(() => {
//             //     console.log(data);
//             //     $scope.chatHistory=data;
//             //     $scope.chatH.push(data)

//             // })

//         });
//     }
// }
