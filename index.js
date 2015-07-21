var through = require('through2');
var path = require('path');
var spawn = require('child_process').spawn;
var fs = require('fs');
var fsx = require('node-fs-extra');
var remove = require('remove');

module.exports = function(){

  this.transform = function(file, encode, callback ){
    // make temporary
    var temp = '.temp/';
    if( !fs.existsSync(temp) )fs.mkdirSync( temp );
    while( temp.length<24 ){
      // generate random dir name
      temp += Math.floor(Math.random()*32).toString(32);
    }
    var tempSrc = temp+'/src';
    var tempDest = temp+'/dest';
    var srcName = path.basename(file.path);
    var destName = path.basename(file.path,'.scss')+'.css';
    fs.mkdirSync( temp );
    fs.mkdirSync( tempSrc );
    fs.mkdirSync( tempDest );
    fsx.copySync( file.path, tempSrc+'/'+srcName);


    // options for Compass compile
    var compassArgs = [
      'compile',
      '--sass-dir', tempSrc,
      '--css-dir', tempDest
    ];
    var compassOptions = {
      cwd: __dirname
    };

    // setup file
    var stream = through();
    // hoge.scss -> hoge.css
    file.path = path.join(path.dirname(file.path),destName);
    file.contents = stream;

    // setup compass 
    var relative = path.relative( __dirname, file.path);
    var compass = spawn('compass', compassArgs, compassOptions );
    compass.stdout.on('data', function(data){
      console.log(data+"");
    });
    compass.stderr.on('data',function(data){
      console.log( 'error:'+data );
    });
    // compass process close
    compass.on('close', function(code){
      stream.write(fs.readFileSync(tempDest+'/'+destName)+'');
      stream.end();
      remove.removeSync( temp );
    });
    this.push( file);
    callback();
  };

  this.flush = function(cb){
  };

  return through.obj( this.transform, this.flush );
};