var through = require('through2');
var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');
var remove = require('remove');

var glob = require('glob');

// Options map for Compass
var optionsNameMap = {
  'quit': '-q', // Quit mode
  'trace': '--trace', // trace error
  'force': '--force', // force overwrite files
  'boring': '--boring', // none color stdout
  'config': '-c', // config file path
  'app': '--app', // compass app
  'appDir': '--app-dir', // base dir app
  'sass': '--sass-dir', // sass dir
  'css': '--css-dir', // css dir
  'image': '--images-dir', // img dir
  'javascript': '--javascript', // js dir
  'font': '--fonts-dir', // font dir
  'enviroment': '-e', // 'develop', 'production'
  'style': '-s',  // css style: 'nested', 'expanded', 'compact', 'compressed'
  'asset': '--relative-assets',
  'noLineComments': '--no-line-comments',
  'http': '--http-path',  // http root
  'generateImagePath': '--generate-image-path',
  'help': '-h'
}


module.exports = function( compassOptions, userSettings){

  // default settings
  var settings = {
    processMax: 4  // of Numnber
  }
  // override default settings
  if(userSettings!=null){
    for(var i in userSettings) settings[i] = userSettings[i];
  }

  var numbering = 0;
  var keepCallback = null;
  var processCount = 0;

  var queue = [];


  this.next = function(){

    if( queue.length <= 0 ) return;
    if( processCount >= settings.processMax ) return;

    var request = queue.shift();
    var file = request.file;

    // for Compass args
    var compassArgs = ['compile', file.path];
    // join command to Compass args
    for( var i in compassOptions ){
      // if name on the map then use it
      var name = optionsNameMap[i] ? optionsNameMap[i] : i;
      compassArgs = compassArgs.concat( [ name, compassOptions[i] ] );
    }

    // compass child process option
    var processOption = {
      cwd: process.cwd()  // current working directory
    };

    // setup compass
    var compass = spawn('compass', compassArgs, processOption );

    // Std Out
    compass.stdout.on('data', function(data){
      console.log(data+'');
    });

    // Std Error
    compass.stderr.on('data',function(data){
      console.log( 'error:'+data );
    });

    // Process close
    compass.on('close', function(code){
      processCount--;
      next();
    });

    processCount++;
    next();
  }

  // gulp transform
  this.transform = function(file, encode, callback ){

    // queue
    queue.push( {file:file} );
    next();

    // progress gulp task
    callback();
  };

  this.flush = function(cb){
  };

  return through.obj( this.transform, this.flush );
};
