/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false */
/* jshint strict: false, -W117 */

app.Constructors.DoorView = function(app){
    var that = this;
    
    this._door = app;
        
    //Renders home page
    this._renderHomePage = function(){ 
        //var networState = this._door._checkConnection();
        
        //this._door._checkConnection();
        var networkState = this._door._checkConnection();
        
        //if(networState === "wifi"){
            var savedUserData = that._door._getUserDataStorage();
            var loginStatus = this._door._getUserLogInStatus();
                      
            if(loginStatus === null || loginStatus.status === false){
                $("#btnLogOut").hide();
                $("#linkUserAccount").hide();
            
                that._hideCheckActivity();
            }else{
                $("#linkUserAccount").text(savedUserData.nickname);           
                $("#btnLogIn").hide();
                $("#btnLogOut").css("display", "block");

                that._showCheckActivity();
            }  
            
            //if user doesn't exist set color gray else check activity and set color 
            if(savedUserData === null){
                $("#btnOpenDoor").addClass("color-gray");
                $("#btnOpenDoor").addClass("button-fill");
                $("#btnOpenDoor").css("display", "block");
                
                //$("#btnOpenDoorWiFi").addClass("color-gray");
                //$("#btnOpenDoorWiFi").addClass("button-fill");     
                //$("#btnOpenDoorInternet").addClass("color-gray");
                //$("#btnOpenDoorInternet").addClass("button-fill");
            }else{
                this._door._checkUserActive(savedUserData, 0, true);            
            }  
        //}     
    };
       
    //Hides form
    this._hideForm = function(formName){  
        $("#" + formName).trigger("reset");        
        that._door._f7.closeModal();
    };
    
    //Shows link to user account and link to check user is active or not
    this._showUserInfo = function(){
        $("#btnLogIn").hide();
        $("#btnLogOut").show();
        $("#linkUserAccount").show();       
    };
    
    //Hides link to user account and link to check user is active or not
    this._hideUserInfo = function(){
        $("#btnLogOut").hide();        
        $("#linkUserAccount").hide();
        $("#btnLogIn").show();
    };
     
    //Hides button check user activity
    this._hideCheckActivity = function(){
        $("#linkCheckUserActive").hide();
    };
    
    //Shows button check user activity
    this._showCheckActivity = function(){
        $("#linkCheckUserActive").show();
    };
    
    //Sets color of the button open door on depend of user is actived or not
    this._setColorBtnOpenDoor = function(userActiveStatus){
        if(userActiveStatus){
            $("#btnOpenDoor").removeClass("color-gray");
            $("#btnOpenDoor").addClass("color-green");
            $("#btnOpenDoor").addClass("button-fill");
            
            /*$("#btnOpenDoorWiFi").removeClass("color-gray");
            $("#btnOpenDoorWiFi").addClass("color-green");
            $("#btnOpenDoorWiFi").addClass("button-fill");
            $("#btnOpenDoorInternet").removeClass("color-gray");
            $("#btnOpenDoorInternet").addClass("color-green");
            $("#btnOpenDoorInternet").addClass("button-fill");*/
        }else{
            $("#btnOpenDoor").removeClass("color-green");
            $("#btnOpenDoor").addClass("color-gray");
            $("#btnOpenDoor").addClass("button-fill");
            
            /*$("#btnOpenDoorWiFi").removeClass("color-green");
            $("#btnOpenDoorWiFi").addClass("color-gray");
            $("#btnOpenDoorWiFi").addClass("button-fill");
            $("#btnOpenDoorInternet").removeClass("color-green");
            $("#btnOpenDoorInternet").addClass("color-gray");
            $("#btnOpenDoorInternet").addClass("button-fill");*/
        }
    };
    
    //Shows button open door
    this._showBtnOpen = function(){
        $("#btnCloseDoor").hide();
        $("#btnOpenDoor").show();
    };
    
    //Shows button close door 
    this._showBtnClose = function(){
        $("#btnOpenDoor").hide();
        $("#btnCloseDoor").css("display", "block");
        $("#btnCloseDoor").show();
    };
       
    //Adds to validation custom method "checkNicknameExist" for check nickname - exsist or not
    /*$.validator.addMethod("checkNicknameExist", function(val, elem){
        var savedUserData = JSON.parse(localStorage.getItem("user-data-access"));
        if(savedUserData !== null && val === savedUserData.nickname){
            return false;
        }else return true;
    }, "user with the same name already exists...");*/
    
    //Adds to validation custom method "checkEmailExist" for check email - exsist or not
    /*$.validator.addMethod("checkEmailExist", function(val, elem){
        var savedUserData = JSON.parse(localStorage.getItem("user-data-access"));
        if(savedUserData !== null && val === savedUserData.email){
            return false;
        }else return true;
    }, "user with the same email already exists...");*/
    
	//Adds to validator custom method for check correct email address
    $.validator.addMethod("checkCorrectEmail", function(val, elem){
        var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(val);
    }, "Invalid address...");
    
    //Sets settings of form validation
    function setValidationSettings(namesValidate){
        var rules = {};
        var messages = {};
        var settings ={};

        namesValidate.forEach(function(item){
            switch(item){
                case "nickname": {
                    rules.nickname = {
                        required: true,
                        //checkNicknameExist: true
                    };
                    
                    messages.nickname = {
                        required: "Field is required..."
                    };
                    
                    break;                       
                }

                case "email": {
                    rules.email = {
                        required: true,
                        email: true,
                        //checkEmailExist: true
                        checkCorrectEmail: true
                    }; 
                    
                    messages.email = {
                        required: "Field is required...",
                        email: "Invalid address..."
                    };
                    
                    break;
                } 
                               
                case "password1": {
                    rules.password1 = {
                        required: true,
                        minlength: 4
                    };
                    
                    messages.password1 = {
                        required: "Field is required...",
                        minlength: "Password can't be less than 4 symbols..."
                    };
                    
                    break;
                }
                    
                case "password2": {
                    rules.password2 = {
                        required: true,
                        equalTo: "#password1"
                    };
                    
                    messages.password2 = {
                        required: "Field is required...",
                        equalTo: "Passwords don't match..."
                    };
                    
                    break;
                }
            }
        }); 
        
        settings.rules = rules;
        settings.messages = messages;
            
        return settings;
    }
       
    //Sets form validate
    this._setFormValidate = function(formName){
        var namesValidate = [];
        
        //Gets attributs names of all inputs of the form
        $("#" + formName + " input").each(function(){
            var attrName = $(this).attr("name");
            namesValidate.push(attrName);
        });

        var settings = setValidationSettings(namesValidate);
               
        $("#" + formName + "").validate({
            rules: settings.rules,
            messages: settings.messages
        });
    };
    
    //Checks errors of form validation
    this._checkValidateErrors = function (formName){
        var selector = "#" + formName + " input.error";
        var errors = $(selector); 
        
        var inputsValues = this._setUserData(formName);
        
        for(var i in inputsValues){
            if(inputsValues[i] === ""){return true;}
        }
        
        if(errors.length > 0){return true;}
        
        return false;
    };
    
    //Set object with info about nickname, password of user  
    this._setUserData = function(formName){
        var selector = "#" + formName + "";
        var arr = $(selector).serializeArray();

        var obj = {};
        $.each(arr, function(i, field){ 
            //Adds value to hiiden field input with name password2
            if(field.name === "password2" && formName === "signUpForm"){
                obj[field.name] = obj.password1;
            }else{
                obj[field.name] = field.value;                
            }              
        });
        
        return obj;
    };
    
    //Shows result of user registration
    this._showUserSignUpResults = function(response){       
        if(response.status !== "bad"){
            this._door._f7.alert("Registration successful!", "Smart Door", this._hideForm("signUpForm"));
        }else{
            var errorMessage = response.incorrect;
            
            this._door._f7.alert(errorMessage + "... Try again!", "Smart Door");
        }
    };
    
    //Shows result of user action
    this._showUserActionResult = function(response){
        //this._door._f7.alert("Door is opened!", "Door"); 
        if(response.status !== "bad"){
             if(response.entrance){
                this._door._f7.alert("Door is opened!", "Smart Door");                
             }
        }else{
            var errorMessage = response.incorrect;      
            this._door._f7.alert(errorMessage, "Smart Door");
        }     
    };
    
    //Shows result of user close door
    this._showResultCloseDoor = function(response){ 
        if(response.status !== "bad"){
            this._door._f7.alert("Door is closed!", "Smart Door");                
        }else{
            var errorMessage = response.incorrect;      
            this._door._f7.alert(errorMessage, "Smart Door");
        }        
    };
    
    //Logs in user after successful registration
    this._logInAfterSignUp = function(){
        var userLogInStatus = {
            status: true
        };
        this._door._saveUserLogInStatus(userLogInStatus);
        
        var userData = this._door._getUserDataStorage();
        $("#linkUserAccount").text(userData.nickname);
        $("#toolBarHome").css("display", "block");
        that._showUserInfo();
    };
     
    //Logs out user
    this._userLogOut = function(){
        this._hideUserInfo();
        
        var userLogInStatus = {
            status: false
        };
        this._door._saveUserLogInStatus(userLogInStatus);
    };
    
    //Sets user active status in account
    this._setUserActiveStatusAccount = function(userActiveStatus){
        $("#userActiveAccount").text(userActiveStatus); 
    };
    
    //Shows user active status after click on link user active
    this._showUserActiveStatus = function(userActiveStatus){
        if(userActiveStatus === true){
            this._door._f7.alert("User is actived!", "Smart Door");           
        }else{
            this._door._f7.alert("User isn't actived!Please contact with administrator!", "Smart Door");
        }       
    };
                   
    //Sets forms validation
    $(function(){     
        var signUpForm = $("#signUpForm").attr("id");
        that._setFormValidate(signUpForm);
        
        var logInForm = $("#logInForm").attr("id");
        that._setFormValidate(logInForm);        
    });
    
    //Registers user
    $("#signUpForm").submit(function(e){
        e.preventDefault();
        
        var networkState = that._door._checkConnection();
        
        var formName = $(this).attr("id");
        var errors =  that._checkValidateErrors(formName);         
        if(errors){return false;}

        var savedUserData = that._door._getUserDataStorage();       
        if(savedUserData){
            that._door._f7.confirm("You will lose your old nickname and old password!", "Smart Door",
                function(){
                    var userData = that._setUserData(formName);
                    that._door._userSignUp(userData);
                    that._hideForm("signUpForm");
                },
                function(){
                    that._hideForm("signUpForm");
            });  
        } else{
            var userData = that._setUserData(formName);         
            that._door._userSignUp(userData);
                       
            $(this).trigger("reset"); 
        }            
    });
          
    //Authorizes user
    $("#logInForm").submit(function(e){
        e.preventDefault();
        
        var networkState = that._door._checkConnection();

        var formName = $(this).attr("id");
        
        var errors =  that._checkValidateErrors(formName);      
        if(errors){return false;}
        
        var userData = that._setUserData(formName);
        //var login = that._door._userLogIn(userData); 
        that._door._userLogInServer(userData); 
        /*if(login){
            that._hideForm("logInForm");
            $("#linkUserAccount").text(userData.nickname);
            that._showUserInfo();
            
            that._showCheckActivity();
        }else{
            $(this).trigger("reset");
            that._door._f7.alert("Invalid login or password!", "Smart Door");
        }    */ 
    });
    
    //Opens door for user
    $("#btnOpenDoor").click(function(){      
        var savedUserData = that._door._getUserDataStorage();
        var loginStatus = that._door._getUserLogInStatus();
        
        if(savedUserData){
            var userUnactive = $("#btnOpenDoor").hasClass("color-gray");
            
            if(userUnactive){
                that._door._f7.alert("Please check activity!", "Smart Door");
            }/*else{
                that._door._userActions();*/
            else if(loginStatus === null || loginStatus.status === false){
                that._door._f7.alert("You must log in!", "Smart Door");
            } else{
                that._door._userActions();
                
                /*setTimeout(function(){
                    that._showBtnOpen();
                }, 32000);*/
            }         
        }else{
            that._door._f7.alert("You must sign up!", "Smart Door");
        }
    });
    
    //Opens door with wifi
    $("#btnOpenDoorWiFi").click(function(){
        var networkState = that._door._checkConnection();
        
        if(networkState !== "wifi"){
            that._door._f7.alert("No wifi", "Smart Door");
            
            return false;
        }
        
        var savedUserData = that._door._getUserDataStorage();
        var loginStatus = that._door._getUserLogInStatus();
        
        if(savedUserData){
            var userUnactive = $("#btnOpenDoorWiFi").hasClass("color-gray");
            
            if(userUnactive){
                that._door._f7.alert("Please check activity!", "Smart Door");
            }/*else{
                that._door._userActions();*/
            else if(loginStatus === null || loginStatus.status === false){
                that._door._f7.alert("You must log in!", "Smart Door");
            } else{
                that._door._userActions();
                
                /*setTimeout(function(){
                    that._showBtnOpen();
                }, 32000);*/
            }         
        }else{
            that._door._f7.alert("You must sign up!", "Smart Door");
        }
    });
    
    //Opens door with internet
    $("#btnOpenDoorInternet").click(function(){
        var networkState = that._door._checkConnection();
        var length = networkState.length;
        
        if(networkState[length - 1] !== "g"){
            that._door._f7.alert("No cell connetion", "Smart Door");
            
            return false;
        }
        
        var savedUserData = that._door._getUserDataStorage();
        var loginStatus = that._door._getUserLogInStatus();
        
        if(savedUserData){
            var userUnactive = $("#btnOpenDoorInternet").hasClass("color-gray");
            
            if(userUnactive){
                that._door._f7.alert("Please check activity!", "Smart Door");
            }/*else{
                that._door._userActions();*/
            else if(loginStatus === null || loginStatus.status === false){
                that._door._f7.alert("You must log in!", "Smart Door");
            } else{
                that._door._userActions();
                
                /*setTimeout(function(){
                    that._showBtnOpen();
                }, 32000);*/
            }         
        }else{
            that._door._f7.alert("You must sign up!", "Smart Door");
        }
    });
    
    //Closes door for user
    $("#btnCloseDoor").click(function(){
        that._door._userCloseDoor();               
    });
    
    //Clears log in Form after click on button log in
    $("#btnLogIn").click(function(){
        $("#logInForm label").hide();
    });
    
    //Hides link to user account and link to check user active or not and set log in status - false
    $("#btnLogOut").click(function(){
        that._userLogOut();
        $("#btnLogIn").trigger("reset");
        
        that._hideCheckActivity();
    });
    
    $("#btnSignUp").click(function(){
        $("#signUpForm label").hide();
    });
    
    //Clears sign up form if user close form
    $("#btnSignUpFormClose").click(function(){
        $("#signUpForm").trigger("reset");
        $("#signUpForm label").hide();
    });
    
    //Clears log in for if user close form
    $("#btnsRowLogInForm").on("click", "a", function(){
        $("#logInForm").trigger("reset");
        $("#logInForm label").hide();
    });
    
    //Renders infor of user in account form
    $("#linkUserAccount").click(function(){
        var savedUserData = that._door._getUserDataStorage();
        $("#userNameAccount").text(savedUserData.nickname);
        //$("#userEmailAccount").text(savedUserData.email);
        $("#userPasswordAccount").text(savedUserData.password1);
        
        var networkState = that._door._checkConnection();
        
        var showAccount = true;
        var userData = that._door._getUserDataStorage();           
        that._door._checkUserActive(userData, showAccount); 
    });
    
    //Shows user is active or not
    $("#linkCheckUserActive").click(function(){
        var showAccount = false;
        var userData = that._door._getUserDataStorage(); 
        if(userData === null){
            that._door._f7.alert("You must sign up!", "Samrt Door");
            
            return false;
        }
        
        var networkState = that._door._checkConnection();
        
        that._door._checkUserActive(userData, showAccount); 
    });
};