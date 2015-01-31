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
    
 
        function prev(){
            $("#placeholder").fadeOut();
             
            if (page>1) {   
               loading();
                setTimeout(function(){app.blog(--page);}, 50);
            }
            
        if (pullDownGeneratedCount==0 && page==1) {
            loading();
            pullDownGeneratedCount++;
            setTimeout(function(){app.blog(page);}, 50);}
        }
        
    this.next = function(){
            $("#placeholder").fadeOut()
            loading();
        if (pullDownGeneratedCount==0 && page==1) {
            loading();
            pullDownGeneratedCount++;
            setTimeout(function(){app.blog(page);}, 50);}
    
    else {
        setTimeout(function(){app.blog(++page);}, 50); }
}
    
    function prevcat(){
        if (catpage>1) {   
           loading();
           setTimeout(function(){app.category(urlParams["cat"], --catpage);}, 50);    
    }
    }
        
    function nextcat(){
        loading();
        setTimeout(function(){app.category(urlParams["cat"], ++catpage);}, 50);
    }