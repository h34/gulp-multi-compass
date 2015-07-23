var through = require('through2');
var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');
var fsx = require('node-fs-extra');
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
    processMax: 1  // of Numnber
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
    var stream = request.stream;


    // make temporaries
    var temp = '.temp/';
    if( !fs.existsSync(temp) )fs.mkdirSync( temp );
    temp = path.join( temp, String(numbering++));
    var tempSrc = temp+'/src';
    var tempDest = temp+'/dest';
    var srcName = path.basename(file.path);
    var destName = path.basename(file.path,'.scss')+'.css';
    if( fs.existsSync(temp) ) remove.removeSync( temp );
    fs.mkdirSync( temp );
    fs.mkdirSync( tempDest );


    // for Compass args
    var compassArgs = ['compile', file.path];
    // join command to Compass args
    for( var i in compassOptions ){
      // if name on the map then use it
      var name = optionsNameMap[i] ? optionsNameMap[i] : i;
      compassArgs = compassArgs.concat( [ name, compassOptions[i] ] );
    }
    // add Temp dirs
    compassArgs = compassArgs.concat( ['--css-dir', tempDest] );

    // setup stream
    // hoge.scss -> hoge.css
    file.path = path.join(path.dirname(file.path),path.basename(file.path,'.scss')+'.css');



    // compass child process option
    var processOption = {
      cwd: __dirname  // current working directory
    };

    // setup compass
    var relative = path.relative( __dirname, file.path);
    var compass = spawn('compass', compassArgs, processOption );

    // Std Out
    compass.stdout.on('data', function(data){
      console.log(data+"");
    });

    // Std Error
    compass.stderr.on('data',function(data){
      console.log( 'error:'+data );
    });

    // Process close
    compass.on('close', function(code){
      var result = glob.sync( path.join(tempDest,'**/*.css') );
      stream.write(fs.readFileSync(result[0])+'');
      stream.end();
      remove.removeSync( temp );  // remove temp directory

      processCount--;
      next();
    });

    processCount++;
    next();
  }

  // gulp transform
  this.transform = function(file, encode, callback ){

    // open this.push( file );
    var stream = through();
    file.contents = stream;

    // queue
    queue.push( {file:file, stream:stream} );
    next();

    this.push(file);

    // progress gulp task
    callback();
  };

  this.flush = function(cb){
  };

  return through.obj( this.transform, this.flush );
};