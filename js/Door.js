/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false */
/* jshint strict: false, -W117 */

var app = {
    Constructors: {}
};

app.Constructors.Door = function(framework7, $$, mainView){
    var that = this; 
    //var url = "http://192.168.1.200/api/v1.0/";
    var url = "";
    var doorView = new app.Constructors.DoorView(this);
      
    this._f7 = framework7;
			
    this._$$ = $$;

    this._mainView = mainView;
    
    //Checks type of connection - wifi or not and set url
    this._checkConnection = function checkConnection() {
        var networkState = navigator.connection.type;
        
        if(networkState === "wifi"){
            url = "http://192.168.1.200/api/v1.0/";           
        }else{
            //location.assign("http://93.125.112.101:8053");
            url = "http://93.125.112.101:8053/api/v1.0/";
        }
        
        console.log(networkState);
        
        return networkState;
    };
            
    //Saves data of user in local storage
    this._saveUserDataStorage = function(userData){
        localStorage.setItem("user-data-access", JSON.stringify(userData));
    };
    
    //Gets data of user from local storage
    this._getUserDataStorage = function(){             
        return JSON.parse(localStorage.getItem("user-data-access"));
    };
    
    //Save log in user or not in local storage
    this._saveUserLogInStatus = function(userLogInStatus){
        localStorage.setItem("user-logIn-status", JSON.stringify(userLogInStatus));        
    };
    
    //Get log in user or not from local storage
    this._getUserLogInStatus = function(){
        return JSON.parse(localStorage.getItem("user-logIn-status"));        
    };
    
    //Saves activity of user to local storage
    this._saveActivityStatus = function(activity){
        localStorage.setItem("activity-status", activity);
    };
    
    //Gets activity status from local storage
    this._getActivityStatus = function(){
        return JSON.parse(localStorage.getItem("activity-status"));
    };
    
    //Registers user
    this._userSignUp = function(userData){        
        var settings = {
            url: url + "users/registration",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(userData),
            success: function(response){
                if(response.status !== "bad"){  
                    that._saveUserDataStorage(userData); 
                    doorView._logInAfterSignUp();
                    doorView._showUserSignUpResults(response);
                    that.showHomePage();
                }         
            },
            error: function(e) {
                doorView._showUserSignUpResults(e.responseJSON);
            }
        };
        
        $.ajax(settings);
    };
 
    //Authorizes user    
    this._userLogIn = function(userData){
        var savedUserData = this._getUserDataStorage();
        if(savedUserData === null || userData.nickname !== savedUserData.nickname || userData.password1 !== savedUserData.password1){        
            return false;
        } 
        
        var userLogInStatus = {
            status: true
        };
        this._saveUserLogInStatus(userLogInStatus);
        
        return true;
    };
    
    //Authorizes user with server
    this._userLogInServer = function(userData){
        //var userData = this._getUserDataStorage();   
        var settings = {
            url: url + "users/registred",
            method: "POST",
            contentType: "application/json",
            dataType: "json",
            headers: {
                "authorization": "Basic " + btoa(userData.nickname + ":" + userData.password1),  
                "cache-control": "no-cache",
            },  
            success: function(response){           
                if(response.registred === "true"){
                    var userLogInStatus = {
                        status: true
                    };
                    
                    that._saveUserDataStorage(userData);
                    that._saveUserLogInStatus(userLogInStatus);
                    
                                
                    doorView._hideForm("logInForm");
                    $("#linkUserAccount").text(userData.nickname);
                    doorView._showUserInfo();

                    doorView._showCheckActivity();
  
                }else{
                    $("#logInForm").trigger("reset");
                    that._f7.alert("Invalid login or password!", "Smart Door");
                } 
                
            }
        };
        
        $.ajax(settings); 
    };
    
    //Opens door for user
    this._userActions = function(){
        var userData = this._getUserDataStorage();       
        var act = {
            "activity": "1"
        };
        
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url + "users/activity",
            "method": "POST",
            "contentType": "application/json",
            "dataType": "json",
            "headers": {
                "authorization": "Basic " + btoa(userData.nickname + ":" + userData.password1),  
                "cache-control": "no-cache",
            },
            "processData": false,
            "data": JSON.stringify(act),
            success: function(response){
               // doorView._showBtnClose();
            },
            error: function(e){
            }
        };
        
        $.ajax(settings);         
    };
    
    //Closes door for user
    this._userCloseDoor = function(){
        var userData = this._getUserDataStorage();   
        var settings = {
            url: url + "users/close_door",
            method: "GET",
            contentType: "application/json",
            dataType: "json",
            headers: {
                "authorization": "Basic " + btoa(userData.nickname + ":" + userData.password1),  
                "cache-control": "no-cache",
            },
            success: function(response){
                doorView._showBtnOpen();
            },
            error: function(e){
            }
        };
        
        $.ajax(settings);         
    };
        
    //Checks user active status
    this._checkUserActive = function(userData, showAccount, forBtnOpenDoor){
        var settings = {
            url: url + "users/is_active",
            method: "GET",
            contentType: "application/json",
            dataType: "json",
            headers: {
                "authorization": "Basic " + btoa(userData.nickname + ":" + userData.password1),  
                "cache-control": "no-cache",
            },            
            success: function(response){
                doorView._setColorBtnOpenDoor(response.is_active);
                
                if(forBtnOpenDoor){                
                    return;
                } 
                
                if(showAccount){               
                    doorView._setUserActiveStatusAccount(response.is_active);                   
                }else{
                    doorView._showUserActiveStatus(response.is_active);
                }               
            }             
        };
               
        $.ajax(settings);  
    };
                          
    //Shows home page
    this.showHomePage = function(){
        doorView._renderHomePage();
    };
    
};