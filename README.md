# gulp-multi-compass
v 0.3.3

Compile in multi process with gulp plugin


# install

```
$ gem install compass
```

```
npm install gulp-multi-compass --save-dev
```

# Usage

```js
var multiCompass = require('gulp-multi-compass');

gulp.src( ['src/**/*.scss'] )
  .pipe(multiCompass())
```

## Options


### Change process max

Optimized for Dual-core
```js
multiCompass({
  processMax: 2
})
```
