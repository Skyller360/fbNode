require("babel-core").transform("code", {"presets": ["latest"]});
var express   = require('express')
var FB = require('fb');
var async = require('async');
var photos = [];

FB.options({version: 'v2.8'});
var now = new Date();
var albums = {};
var friends = {};
var checkins = {};

var fbContent = [];

for(var i = new Date().getFullYear() - 2008; i >= 0; i--)
{
    var year = {
        year: 2008+i,
        loaded: false,
        data: []
    }
    if(year.year == new Date().getFullYear())
    {

    }
    else{
        for(var j = 0; j <= new Date().getMonth(); j++)
        {
            console.log('test', year.year, j, new Date().getMonth());
            var month = {
                month: j+1,
                loaded: false,
                data: []
            }

            year.data.push(month);
        }
    }
    fbContent.push(year);
}

var msbApp = FB.extend({appId: '226344767405056', appSecret: '50bc10aeaeab238a0b55e8073ece7b62'});

msbApp.setAccessToken('EAADN2ZC91PAABACz1CWZAotJunNpZBld1MdfDKTczP7UNDlhIYK7YA3sxZBwqyFngjIAAdbKGYu3vAQckRKu0rZAKMLKeymOmiFDMFHU1ZAukwJJ8Amed400ZClT9pqEKYT2Nr6vJOorafnUI6TbIJljMZBwoaL9kkFb3X9WcYA5dgZDZD');

var callChildren = function(albums){

    albums.map(function(element) {
        // console.log('test', element);

        msbApp.api(element.id + '?fields=photos.limit(500){id,backdated_time,name,name_tags,width,likes.limit(10000),reactions.limit(10000),comments.limit(10000),images,album, created_time}', function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }

            // console.log(res);
            if(res.photos){
                photos.push(res.photos.data);
                if(photos.length == 9){
                    photos = sortArray(photos);
                }
            }
        });
    });
};

msbApp.api('me?fields=albums.limit(500){id, name, cover_photo, count, description}', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  albums = res.albums.data;

  callChildren(albums);

});

msbApp.api('me?fields=tagged_places.limit(1000){created_time,id,place}', function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }
    places = res;
    console.log(places);
});

var sortArray = function(array){

    console.log('LENGTH = ', array.length);

    for(var i = 0; i < array.length; i++){
        
        var length = array.length ? array.length : 1;
        
        for(var j = 0; j < length; j++){
            if((array[i][j + 1] && array[i][j]) &&array[i][j].created_time > array[i][j + 1].created_time){
                var temp = array[i][j];
                array[i][j] = array[i][j + 1];
                array[i][j + 1] = temp;
            }
        }
    }



    // for (var i = array.length - 1; i >= 0; i--){
    //     for(var j = 1; j <= i; j++){
    //         // console.log('PRESWITCH', array[i][j]);
    //         if((array[i][j - 1] && array[i][j]) && array[i][j - 1].created_time > array[i][j].created_time){
    //             // console.log('SWITCH', array[i][j-1].created_time, array[i][j].created_time);
    //             var temp = array[i][j-1];
    //             array[i][j-1] = array[i][j];
    //             array[i][j] = temp;
    //         }
    //     }
    // }

    // console.log(array);

    // if(array.length == 9){
    //     for(var i = 0; i < array.length; i++){
    //         for(var j = 0; j < array.length; j++){
    //             if(array[i][j]){
    //                 console.log('CREATED AT', array[i][j].created_time);
    //             }
    //         }
    //     }
        
    // }

    return array;
}