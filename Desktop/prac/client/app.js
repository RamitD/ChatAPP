var app = angular.module("myApp", ["ngRoute"]);
        app.config(function ($routeProvider) {
            $routeProvider
                .when("/signup", { templateUrl: "/store/signup.html" })
                .when("/login", { templateUrl: "/store/login.html" })
                .when("/forgotPassword", { templateUrl: "/store/forgotpassword.html" })
                .when("/resetPassword", { templateUrl: "/store/resetpass.html" })
        });

app.controller("MyCtrl", myCtrl);
function myCtrl($location, $http){
    // this.email="email";
    // this.password="password";
    this.output = "";
    this.data={};
    this.dataL={};
    this.dataF={};
    this.dataR={};
    this.clickSignup = function(){
        $location.path("/signup");       
    }
    this.clickLogin = function(){
        $location.path("/login");       
    }
    this.clickResetPassword = function(){
        $location.path("/resetPassword");       
    }
    this.clickForgotPassword = function(){
        $location.path("/forgotPassword");       
    }
    this.addUser=function(name, email, password){
         this.data={
            name: name,
            email: email,
            password: password
        }
        $http({
            url: "http://localhost:8000/user/signup",
            method: "POST",
            data: this.data
        }).then(response=>{
            if(response){
                this.output="User Adder";
            }
        })
        .catch(err=>{
            if(err){
                this.output="Unable to add user";
            }
        })
    }
    this.userLogin=function(email, password){
        this.dataL={
            email: email,
            password: password,
            token: ""
        }
        this.outputL="Unable to Login";
        $http({
            method: "POST",
            url:"http://localhost:8000/user/login",
            data : this.dataL
        })
        .then(response=>{
            if(response){
                $http.defaults.headers.common['Authorization'] = response.data.info.token;
                this.outputL="User Logged In";
            }
        }).catch(err=>{
            if(err){
                this.outputL="Unable to Login!!!";
            }
        })

    }
    this.resetPassword=function(email, password, newpassword){
        this.dataR={
            email: email,
            password: password,
            newpassword: newpassword
        }
        $http({
            method: "PATCH",
            url: "http://localhost:8000/user/resetpass",
            data: this.dataR
        })
        .then(response=>{
            if(response){
                this.outputR=response.data;
            }
        }).catch(err=>{
            if(err){
                this.outputR=response.data;
            }
        })    
    }

    this.forgotPassword=function(email){
        this.dataF={
            email: email
        }
        $http({
            method: "POST",
            url:"http://localhost:8000/user/forgotpass",
            data : this.dataF
        })
        .then(response=>{
            if(response){
                this.outputF="Mail Sent";
            }
        }).catch(err=>{
            if(err){
                this.outputF=response.data;
            }
        });

    }
    
}
