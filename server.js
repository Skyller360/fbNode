require("babel-core").transform("code", {"presets": ["latest"]});
var express   = require('express')
var FB = require('fb');
var async = require('async');
var photos = [];

FB.options({version: 'v2.8'});
var now = new Date();
var albums = {};

var msbApp = FB.extend({appId: '226344767405056', appSecret: '50bc10aeaeab238a0b55e8073ece7b62'});

msbApp.setAccessToken('EAADN2ZC91PAABAHUj4mVbfSynwqXfmqYGUVD6cl7apy0PP5EYLARWuzyywrXXxSAlRwEpRySB9DGHbw7DhOQBZAcXIZA0eWGUGRptU5Wg6EvGkLJAG90skRYFfRoEDenlv23r45RKc4lzMcogueHewlLZAj6XjAbwpsTyg9sIwZDZD');

msbApp.api('me?fields=albums.limit(500){id, name, cover_photo, count, description}', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  albums = res.albums.data;

  callChildren(albums);

});

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
}

var sortArray = function(array){

    console.log('LENGTH = ', array.length);

    for(var i = 0; i < array.length; i++){
        
        var length = array.length ? array.length : 1;
        
        for(var j = 0; j < length; j++){
            console.log(i, j);
            if(array[i][j].created_time > array[i][j + 1]){
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