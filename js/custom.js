  var page = 1, catpage = 1;
        
function loading(){
$.mobile.loading('show', {
    theme: "b",
    text: "Loading...",
    textonly: false,
    textVisible: true
});
        $("body").find("*").attr("disabled", "disabled");
$("body").find("a").click(function (e) { e.preventDefault(); });
}

function doneLoading(){
     $.mobile.loading('hide');
     $("body").find("*").removeAttr("disabled");
     $("body").find("a").unbind("click");
}
    
 
function showMessage(msg, time){
     $.mobile.loading('show', {
                theme: "b",
                text: msg,
                textonly: true,
                textVisible: true
            });   
              
          setTimeout(function(){$.mobile.loading('hide');}, time);
}


        function prev(){
             
            if (page>1) {    
                loading();
                setTimeout(function(){app.blog(--page);}, 2000);
            }
            else {
               showMessage('No more new posts to show.', 1000);
            }
            
        if (pullDownGeneratedCount==0 && page==1) {
            loading();
            pullDownGeneratedCount++;
            setTimeout(function(){app.blog(page);}, 2000);}
        }

        
    this.next = function(){
            loading();
        if (pullDownGeneratedCount==0 && page==1) {
            pullDownGeneratedCount++;
            setTimeout(function(){app.blog(page);}, 2000);}
    
    else {
        setTimeout(function(){app.blog(++page);}, 2000); 
}
    }
    
    function prevcat(){
        if (catpage>1) {   
           loading();
           setTimeout(function(){app.category(urlParams["cat"], --catpage);}, 50);    
    }
        else {
               showMessage('No more new posts to show.', 1000);
            }
    }
        
    function nextcat(){
        loading();
        setTimeout(function(){app.category(urlParams["cat"], ++catpage);}, 50);
    }


function handleError(xhr, textStatus, errorThrown){
         
            var errorMessage = setInterval(function(){
       $.mobile.loading('show', {
    theme: "b",
    text: 'Error' + ": " + errorThrown + " Please try again later.",
    textonly: true,
    textVisible: true
});
        clearInterval(errorMessage);
    },1); 
    var clearErrorMessage = setInterval(function(){$.mobile.loading('hide');clearInterval(clearErrorMessage);},3000); 
}