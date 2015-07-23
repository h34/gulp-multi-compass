var through = require('through2');
var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');
var remove = require('remove');

// Options map for Compass
var optionsNameMap = {
  'noSourcemap': '--no-sourcemap', // off generate soucemap
  'soucemap': '--sourcemap', // generate soucemap
  'time': '--time', // show time
  'debugInfo': '--debugInfo', // on debug info
  'noDebugInfo': '--no-debug-info', // off debug info
  'require': '-r',  // require library
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
  'generateImagePath': '--generate-image-path'
  //,'help': '-h'
}


module.exports = function( compassOptions, userSettings){

  // join command to Compass args
  var optionCompassArgs = [];
  for( var i in compassOptions ){
    // if name on the map then use it
    if( optionsNameMap[i] != null ) optionCompassArgs = optionCompassArgs.concat( [ optionsNameMap[i], compassOptions[i] ] );
  }

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
    var compassArgs = ['compile', file.path].concat(optionCompassArgs);
    // console.log( compassArgs);


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
