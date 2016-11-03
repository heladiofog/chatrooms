// server file:
var http = require('http'); //HTTP and client functionality
var fs = require ('fs');    //Filesystem-related functionality
var path = ('path');        //Filesystem path funcionality
var mime = require('mime'); //ability to derive a MIME type based on a filename extension
var cache = {};             //cache object where chached files will be stored


