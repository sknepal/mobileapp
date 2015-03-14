 /*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements. See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership. The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License. You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/
var title;
var url;
this.share = function(name, uri) {
    if (typeof name === 'undefined' || typeof uri === 'undefined') {window.plugins.socialsharing.share(title, null, null, url);}
  else { title = name;
          url = uri;
       }
 return;
};

Handlebars.registerHelper('share', share);
 Handlebars.registerHelper('strip-scripts', function(context) {
      var html = context;
      // context variable is the HTML you will pass into the helper
      // Strip the script tags from the html, and return it as a Handlebars.SafeString
      return new Handlebars.SafeString(html);
    });
Handlebars.registerHelper("prettifyDate", function(timestamp) {
    return new Date(timestamp).toDateString()
});
//Handlebars.registerHelper("share", function(title, url) {
//  phoneNumber = phoneNumber.toString();
//  return "(" + phoneNumber.substr(0,3) + ") " + 
//    phoneNumber.substr(3,3) + "-" + 
//    phoneNumber.substr(6,4);
//});

Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);
  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
         app.receivedEvent('deviceready');
    // navigator.splashscreen.show();

     // if (!window.plugins.socialsharing) {alert('sorry not initialized');}
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');
    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');
    console.log('Received Event: ' + id);
  },
commentSubmit: function(name, email, comment, id_of_post){
$.ajax({
url: 'http://www.thetaranights.com/api/respond/submit_comment/?post_id=420' + '&name=' + name + '&email=' + encodeURIComponent(email) + '&content=' + comment,
type: 'GET',
dataType: 'json',
success: function(data) {
   var successMessage = data.status;
    if(0 == successMessage.localeCompare("pending") || 0 == successMessage.localeCompare("ok")) {
        var intervalSuccess = setInterval(function(){
                $.mobile.loading('show', {
                theme: "b",
                text: "Your comment has been submitted. The author may still need to approve it before it appears.",
                textonly: true,
                textVisible: true
                });clearInterval(intervalSuccess);},1);
        $("form").trigger('reset');
        $('#popupComment').popup('close');
    }
    
    else {
        var intervalError = setInterval(function(){
                $.mobile.loading('show', {
                theme: "b",
                text: "Error: " + data.error,
                textonly: true,
                textVisible: true
                });clearInterval(intervalError);},1); 
    }
    
    doneLoading();
    var doneCommentMessage = setInterval(function(){$.mobile.loading('hide');clearInterval(doneCommentMessage);},2500); 
    
    // var interval3 = setInterval(function(){ window.location.href='single.html';clearInterval(interval3);}, 3000);
},

      error: function(xhr, textStatus, errorThrown) {
    // Handle error
          doneLoading();
          if (errorThrown == 'Conflict') { errorThrown = 'A similar comment has already been submitted.';}
          handleError(xhr, textStatus, errorThrown);
          $("form").trigger('reset');
          $('#popupComment').popup('close');
  }

});
},
    
  
authors: function(){
    $.ajax({
      url: 'http://thelacunablog.com/api/get_author_index',
      type: 'GET',
      dataType: 'json',
      success: function(data){
        var source = $("#author-template").html();
        var template = Handlebars.compile(source);
        var authorData = template(data);
        $('#authorslist').html(authorData);
        $('#authorslist').trigger('create');
        $('#authorslist').listview('refresh');
      },
      error: function(data){
        console.log(data);
      }
    });
  }
,

authorposts: function(authorname){
    function getauthorBlogs() {
     var dfd = $.Deferred();
      $.ajax({
        url: 'http:thelacunablog.com/?json=get_author_posts&slug=' + authorname,
        type: 'GET',
        dataType: 'json',
        success: function(data){
          var source = $("#authorpost-template").html();
          var template = Handlebars.compile(source);
          var authorpostsData = template(data);
          $('#authorpost-data').html(authorpostsData);
          $('#authorpost-data').trigger('create');
          $('#all-posts').listview('refresh');
          dfd.resolve(data);
          // var source = $("#blog-template").html();
          // var template = Handlebars.compile(source);
          // var blogData = template(data);
          // $('#blog-data').html(blogData);
          // $('#blog-data').trigger('create');
          // dfd.resolve(data);
        },
        error: function(data){
          console.log(data);
        }
      });
      return dfd.promise();
    };
    getauthorBlogs().then(function(data){
      $('#all-posts').on('click','li', function(e){
        localStorage.setItem('authorblogData', JSON.stringify(data.posts[$(this).index()]));
      });
    });
  },

authsingle: function() {

  var postDataStore = localStorage.getItem('authorblogData');
  var source   = $("#authsingle-template").html();
  var template = Handlebars.compile(source);
  var authorpostDat = template(JSON.parse(postDataStore));
  $('#authsingle-data').html(authorpostDat);

},  
    
  blog: function(pagecount){
    function getBlogs() {
     var dfd = $.Deferred();
      $.ajax({
        url: 'http://thelacunablog.com/api/get_recent_posts/?page=' + pagecount + '&count=12',
        type: 'GET',
        dataType: 'json',
        success: function(data){
        if (data.count != '0') {
          var source = $("#blog-template").html();
          var template = Handlebars.compile(source);
          var blogData = template(data);
        $('#all-posts').html(blogData);
             $('#all-posts').listview('refresh');
        $('#all-posts').trigger('create');
        $('#all-posts').listview('refresh');
           doneLoading();
          dfd.resolve(data);
        }
            else {    
               doneLoading();
              showMessage('No more posts. Loading latest posts...', 2500);
              setTimeout(function(){loading(); page = pagecount = 1; app.blog(pagecount);}, 3000);
          } 
                
        },
        error: function(xhr, textStatus, errorThrown) {
                doneLoading();
                handleError(xhr, textStatus, errorThrown);
        }
      });
        
      return dfd.promise();
        
    };
    getBlogs().then(function(data){
      $('#all-posts').on('click','li', function(e){
        localStorage.setItem('postData', JSON.stringify(data.posts[$(this).index()]));
          
      });
    });
  },
  single: function() {
    var postDataStorage = localStorage.getItem('postData');
    var source   = $("#single-template").html();
    var template = Handlebars.compile(source);
    var postData = template(JSON.parse(postDataStorage));
    $('#single-data').html(postData);
  $('#single-data').trigger('create');
/*      $('#single-data').trigger('updatelayout');
      //$('#single-data').iscrollview();*/
      $('#blog-content').iscrollview("refresh");
      
      
     // $('#single-data').iscrollview("refresh");
     
},
category: function(slug, count){
  function getCategories() {
    var dfd = $.Deferred();
       var interval4;
    $.ajax({
      url: 'http://thelacunablog.com/?json=get_category_posts&slug=' + slug + '&page=' + count + '&count=12',
      type: 'GET',
      dataType: 'json',
      success: function(data){
          
           if (data.count != '0') {
        var source   = $("#blog-template").html();
        var template = Handlebars.compile(source);
        var blogData = template(data);
        $('#categoryposts').html(blogData);
        $('#categoryposts').trigger('create');
        $('#categoryposts').listview('refresh');
          doneLoading();
          dfd.resolve(data);
           }
          else { 
              doneLoading();
              showMessage('No more posts. Loading latest posts...', 2500);
            setTimeout(function(){loading();  catpage = count = 1;app.category(slug, count);}, 3000);
          }    
      },
      error: function(data){
        doneLoading();
        handleError(xhr, textStatus, errorThrown);
      }
    });
    return dfd.promise();
  };

  getCategories().then(function(data){
    $('#categoryposts').on('click','li', function(e){
      localStorage.setItem('postDat', JSON.stringify(data.posts[$(this).index()]));
    });
  });


},
catsingle: function() {

  var postDataStore = localStorage.getItem('postDat');
  var source   = $("#catsingle-template").html();
  var template = Handlebars.compile(source);
  var postDat = template(JSON.parse(postDataStore));
  $('#catsingle-data').html(postDat);
     $('#catsingle-data').trigger('create');
       $('#blog-content').iscrollview("refresh");

},

  portfolio: function(){
    $.ajax({
      url: 'http://thelacunablog.com/?json=get_recent_posts&post_type=portfolio',
      type: 'GET',
      dataType: 'json',
      success: function(data){
        var source = $("#portfolio-template").html();
        var template = Handlebars.compile(source);
        var portfolioData = template(data);
        $('#portfolio-data').html(portfolioData);
        $('#portfolio-data').trigger('create');
      },
      error: function(data){
        doneLoading();
        handleError(xhr, textStatus, errorThrown);
      }
    });
  }
};
