var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');


module.exports = new function(){
  // Options map for Compass
  var optionNames = {
    'noSourcemap': '--no-sourcemap', // off generate soucemap
    'soucemap': '--sourcemap', // generate soucemap
    // 'time': '--time', // show time
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
  var optionFlags = {
    'time': '--time'
  }


  this.compile = function(files, options, handlers){

    // options to args
    var args = [];
    for( var i in options ){
      if( optionNames[i] ) args = args.concat( [ optionNames[i], options[i] ] );
      if( optionFlags[i] ) args = args.push( optionFlags[i] );
    }

    // for Compass args
    args = ['compile'].concat(files, args);

    // compass child process option
    var processOption = {
      cwd: process.cwd()  // current working directory
    };

    // setup compass
    var compassProcess = spawn('compass', args, processOption );

    return compassProcess;
  }


}();