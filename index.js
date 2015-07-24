var through = require('through2');
var path = require('path');

var compass = require('./lib/compass');

module.exports = function( options ){

  // default settings
  var settings = {
    processMax: 4  // of Numnber
  }
  // override to settings
  if(options!=null){
    for(var i in options) settings[i] = options[i];
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

    var filesTable = [];  // divided files list
    var processMax = Math.min( files.length, settings.processMax );
    var processCount = processMax;  // alived process count

    console.log( 'Compile '+files.length+' files in '+processMax+' process' );

    // files divide to filesTable
    var freeProcess,hadFiles;
    for(var i=0;i<processMax;i++){
      freeProcess = processMax-i;
      hadFiles = Math.round(files.length/freeProcess);
      filesTable.push( files.splice(0,hadFiles) );
    }

    // divide with process count
    /*
    for(var i=0,len=files.length;i<len;i++){
      filesTable[i%processMax].push(files[i]);
    }
    */


    // process end was call
    var end = function(){
      // all process end
      if( (--processCount)<=0 ){
        callback();
      }
    };

    // create process and handling
    for(var i=0;i<processMax;i++){
      // process spawn
      var proc = compass.compile( filesTable[i], options );
      // std out
      proc.stdout.on('data', function(data){
        console.log(data+'');
      })
      // std error
      proc.stderr.on('data',function(data){
        console.error(data+'');
      });
      // process close
      proc.on('close',function(){
        end();
      });
    }

  };

  return through.obj( this.transform, this.flush );
};
