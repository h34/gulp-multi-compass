var through = require('through2');
var path = require('path');

var compass = require('./lib/compass');

module.exports = function( compassOptions, userSettings){

  // default settings
  var settings = {
    processMax: 4  // of Numnber
  }
  // override to settings
  if(userSettings!=null){
    for(var i in userSettings) settings[i] = userSettings[i];
  }

  // from gulp src files
  var files = [];

  // gulp transform
  this.transform = function(file, encode, callback ){
    // add list file path
    files.push( path.relative(process.cwd(), file.path) );
    // progress gulp task
    callback();
  };


  this.flush = function(callback){

    var end = function(){
      // callback();
    }

    var filesTable = [];  // divided files list
    var processMax = settings.processMax;
    var processCount = processMax;  // alived process count

    // process end was call
    var end = function(){
      // all process end
      if( (--processCount)<=0 ){
        console.log("all proesss end")
        callback();
      }
    };

    // divide with process count
    for(var i=0,len=files.length;i<len;i++){
      filesTable[i%processMax] = files[i];
    }

    // create process and handling
    for(var i=0;i<processMax;i++){
      // process spawn
      var proc = compass.compile( files, compassOptions );
      // std out
      proc.stdout.on('data', function(data){
        console.log(data+'');
      })
      // std error
      proc.stderr.on('data',function(data){
        console.log(data+'');
      });
      // process close
      proc.on('close',function(){
        console.log('process closed');
        end();
      });
    }

  };

  return through.obj( this.transform, this.flush );
};
