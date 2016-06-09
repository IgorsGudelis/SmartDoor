/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false */
/* jshint strict: false, -W117 */

(function(){
    var framework7 = new Framework7({
        animateNavBackIcon: true,
        modalTitle: "Open Door",
        modalButtonOk: "OK",
        modalButtonCancel: "Cancel",
        cache: true
    }); 
    

            
    var $$ = Dom7;
        
    //Initializes main view
    mainView = framework7.addView('.view-main', {
        dynamicNavbar: true,
        domCache: true, //чтобы навигация работала без сбоев и с запоминанием scroll position в длинных списках
    });
    
    function onAppReady() {
        var door = new app.Constructors.Door(framework7, $$, mainView); 
        door.showHomePage();
    }
    document.addEventListener("app.Ready", onAppReady, false) ; 
    
})();

(function(){
    
})();

