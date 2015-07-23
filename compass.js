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


module.exports = new function(){
  this.compile = "test";
}();