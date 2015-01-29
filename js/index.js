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
    // $('#popupComment').html(data);
    // alert(data);
  //   var json = JSON.parse(data);
   var successMessage = data.status;
    var pending = "pending";
    
                    if(0 == successMessage.localeCompare(pending)) {
                       // return '"true"';
                        var intervalSuccess = setInterval(function(){
       $.mobile.loading('show', {
    theme: "b",
    text: "Your comment has been submitted. The author may still need to approve it before it appears.",
    textonly: true,
    textVisible: true
});
        clearInterval(intervalSuccess);
    },1); 
                    }
    
    else {
                    //return "\"" + json.error + "\"";
    var interval = setInterval(function(){
       $.mobile.loading('show', {
    theme: "b",
    text: "Error: " + data.error,
    textonly: true,
    textVisible: true
});
        clearInterval(interval);
    },1); 
    
    }
var interval2 = setInterval(function(){$.mobile.loading('hide');clearInterval(interval2);},5000); 
//var interval3 = setInterval(function(){window.location.href='single.html';clearInterval(interval3);}, 3000);
   
    
}});
},

    
  blog: function(page){
    function getBlogs() {
     var dfd = $.Deferred();
      $.ajax({
        url: 'http://thelacunablog.com/api/get_recent_posts/?page=' + page + '&count=8',
        type: 'GET',
        dataType: 'json',
        success: function(data){
          var source = $("#blog-template").html();
          var template = Handlebars.compile(source);
          var blogData = template(data);
          //  $('#list').append("<li>"+ data.title + "<li>");
            
        $('#all-posts').html(blogData);
            
        $('#all-posts').listview('refresh');
        //    $('#list').listview('refresh');
            $('#blog-data').listview().listview('refresh');
           //// $('#blog-data').listview('refresh');
           $("ul:jqmData(role='listview')").listview("refresh");
            $('#all-posts').trigger('create');
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
    getBlogs().then(function(data){
         //localStorage.removeItem('postData');
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
},
category: function(slug, count){
  function getCategories() {
    var dfd = $.Deferred();
    $.ajax({
      url: 'http://thelacunablog.com/?json=get_category_posts&slug=' + slug + '&page=' + count,
      type: 'GET',
      dataType: 'json',
      success: function(data){
        var source   = $("#blog-template").html();
        var template = Handlebars.compile(source);
        var blogData = template(data);
        $('#blog-data').html(blogData);
        $('#blog-data').trigger('create');
        dfd.resolve(data);

      },
      error: function(data){
        console.log(data);
      }
    });
    return dfd.promise();
  };

  getCategories().then(function(data){
    $('#all-posts').on('click','li', function(e){
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
        console.log(data);
      }
    });
  }
};
