
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
 var searchFound;
var url;

this.share = function (name, uri) {
    if (typeof name === 'undefined' || typeof uri === 'undefined') {
        window.plugins.socialsharing.share(title, null, null, url);
    }
    else {
        title = name;
        url = uri;
    }
    return;
};

Handlebars.registerHelper('share', share);
Handlebars.registerHelper('strip-scripts', function (context) {
    var html = context;
    // context variable is the HTML you will pass into the helper
    // Strip the script tags from the html, and return it as a Handlebars.SafeString
    return new Handlebars.SafeString(html);
});
Handlebars.registerHelper("prettifyDate", function (timestamp) {
    return new Date(timestamp).toDateString()
});
//Handlebars.registerHelper("share", function(title, url) {
//  phoneNumber = phoneNumber.toString();
//  return "(" + phoneNumber.substr(0,3) + ") " + 
//    phoneNumber.substr(3,3) + "-" + 
//    phoneNumber.substr(6,4);
//});

Handlebars.registerHelper("debug", function (optionalValue) {
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
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        // navigator.splashscreen.show();

        // if (!window.plugins.socialsharing) {alert('sorry not initialized');}
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    },
    commentSubmit: function (name, email, comment, id_of_post) {
        $.ajax({
            url: 'http://www.thetaranights.com/api/respond/submit_comment/?post_id=420' + '&name=' + name + '&email=' + encodeURIComponent(email) + '&content=' + comment,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var successMessage = data.status;
                if (0 == successMessage.localeCompare("pending") || 0 == successMessage.localeCompare("ok")) {
                    var intervalSuccess = setInterval(function () {
                        $.mobile.loading('show', {
                            theme: "b",
                            text: "Your comment has been submitted. The author may still need to approve it before it appears.",
                            textonly: true,
                            textVisible: true
                        });
                        clearInterval(intervalSuccess);
                    }, 1);
                    $("form").trigger('reset');
                    $('#popupComment').popup('close');
                }

                else {
                    var intervalError = setInterval(function () {
                        $.mobile.loading('show', {
                            theme: "b",
                            text: "Error: " + data.error,
                            textonly: true,
                            textVisible: true
                        });
                        clearInterval(intervalError);
                    }, 1);
                }

                doneLoading();
                var doneCommentMessage = setInterval(function () {
                    $.mobile.loading('hide');
                    clearInterval(doneCommentMessage);
                }, 2500);

                // var interval3 = setInterval(function(){ window.location.href='single.html';clearInterval(interval3);}, 3000);
            },

            error: function (xhr, textStatus, errorThrown) {
                // Handle error
                doneLoading();
                if (errorThrown == 'Conflict') {
                    errorThrown = 'A similar comment has already been submitted.';
                }
                handleError(xhr, textStatus, errorThrown);
                $("form").trigger('reset');
                $('#popupComment').popup('close');
            }

        });
    },


    authors: function () {
        var dfd = $.Deferred();
        $.ajax({
            url: 'http://thelacunablog.com/api/get_author_index',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var source = $("#author-template").html();
                var template = Handlebars.compile(source);
                var authorData = template(data);
                $(".wrapperb .iscroll-content").append("<ul data-role='listview' data-inset='true' id='authorslist' data-dismissible='false' data-filter='true' data-filter-placeholder='Search for an author...'> </ul>");
                $(".wrapperb").trigger("create");
               
                $("#authorslist").html(authorData);
                
                        $(".wrapperb").iscrollview("resizeWrapper");
                        $(".wrapperb").iscrollview("refresh");
                $("#authorslist").listview("refresh");
            //     $(".wrapper").listview().listview("refresh");
                    //$('.wrapper').listview('refresh');
                doneLoading();
                dfd.resolve(data);

            },
            error: function (xhr, textStatus, errorThrown) {
                doneLoading();
                handleError(xhr, textStatus, errorThrown);
            }
        });
    },

    single: function () {
        var postDataStorage = localStorage.getItem('postData');
        var source = $("#single-template").html();
        var template = Handlebars.compile(source);
        var postData = template(JSON.parse(postDataStorage));
        $('#single-data').html(postData);
        $('#single-data').trigger('create');

    },
      page: function (slug) { 
        $.ajax({
            url: 'http://thelacunablog.com/?json=get_page&slug=' + slug,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var source = $("#page-template").html();
                var template = Handlebars.compile(source);
                var pageData = template(data);
               $('#page-data').html(pageData);
        $('#page-data').trigger('create');
                      
                doneLoading();

            },
            error: function (xhr, textStatus, errorThrown) {
                doneLoading();
                handleError(xhr, textStatus, errorThrown);
            }
        });
    },  
       get: function (type, pagecount, arg) {
        function getPosts() {
            var jsonRequest;
            var count = 13; var wrap ;
          var listview = "home-page-posts";
            var dfd = $.Deferred();
              var templatesource = "#blog-template";
            var jsonURL = "http://thelacunablog.com/?json=";
            if (type == 'category') {
                jsonRequest = "get_category_posts";
                jsonURL += jsonRequest;
                jsonURL += '&slug=' + arg + '&page=' + pagecount + '&count=' + count;
                wrap = ".cwrapper";
                listview = $.mobile.activePage.attr('id') + "-posts";
              templatesource = "#cat-template";
               
                
            }
            else if (type == 'search') {
                jsonRequest = "get_search_results";
                jsonURL += jsonRequest;
                jsonURL += '&search=' + arg + '&page=' + pagecount + '&count=' + count;
                templatesource = "#search-template";
                wrap = ".swrapper";
            }
            else if (type == 'blog') {
                jsonRequest = "get_recent_posts";
                jsonURL += jsonRequest;
                jsonURL += '&page=' + pagecount + '&count=' + count;
          //   $.mobile.activePage.attr('id') + "-posts";
           wrap = ".wrapper";
            }
            else { // type == 'author'
                jsonRequest = "get_author_posts";
                jsonURL += jsonRequest;
                jsonURL += '&slug=' + arg + '&page=' + pagecount + '&count=' + count;
            }
       
  /*          var dfd = $.Deferred();
             jQuery.mobile.pageContainer.pagecontainer('change', window.location.href, {
    allowSamePageTransition: true,
    transition: 'none',
    reload: true 
    // 'reload' parameter not working yet: //github.com/jquery/jquery-mobile/issues/7406
  });*/
            
            $.ajax({
                url: jsonURL,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    if (data.count != '0') {
                    if (type=='search') searchFound = true;
                    var source = $(templatesource).html();
                    var template = Handlebars.compile(source);
                    var resultData = template(data);
                          // $("#category-page").trigger('pagecreate');
                    //    $(wrap + " .iscroll-content").html();
                    $(wrap + " .iscroll-content").append("<ul data-role='listview' data-inset='true' id='" + listview + "' data-dismissible='false'> </ul>");
                    $(wrap).trigger("create");
                  //  $('#all-posts').listview('refresh');
                    $('#' + listview).html(resultData);
                    $('#' + listview).listview('refresh');
                    $( wrap).iscrollview("resizeWrapper");
                    $(wrap).iscrollview("refresh");
                     
                    doneLoading();
                        
                       // pageContainerElement.page({ domCache: true });
                    dfd.resolve(data);
                    }
                    else {
                        doneLoading();
                        if ((type=='search' && searchFound==true) || type!='search'){
                        showMessage('There is nothing beyond this that matches your query. Returning to the first page instead.', 3000);
                        setTimeout(function(){ loading(); page =1; app.get(type, page, arg);}, 3000);
                        }
                        else {
                            searchFound = false;
                            showMessage('Not found. Please search with a different keyword again.', 1500); 
                            setTimeout(function(){ $("#popupSearch").popup("open"); }, 2000);   
                    } 
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    doneLoading();
                    handleError(xhr, textStatus, errorThrown);
                }
            });
            return dfd.promise();
        };
        getPosts().then(function (data) {
            //   localStorage.removeItem("postData");
            $('#' + $.mobile.activePage.attr('id') + '-posts').on('click', 'li', function (e) {
                localStorage.setItem('postData', JSON.stringify(data.posts[$(this).index()]));
                  // $( "#category-page" ).page( 'option', 'domCache', true );
 
              //  if ($.mobile.activePage.attr('id') == 'category-page') viewed = true;
            });
            
        });
    }
};/*

func: function (type, jsonURL){
    if (type!='search') { return 1; }
    else {
           $.ajax({
                url: jsonURL,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    if (data.count != '0') {
                        return 1;
                   // dfd.resolve(data);
                    }
                    else {
                        return 0;
                    } 
                },
                error: function (xhr, textStatus, errorThrown) {
                    doneLoading();
                    handleError(xhr, textStatus, errorThrown);
                }
            });
        
    }*/
    

