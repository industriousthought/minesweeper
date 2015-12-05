browserify --debug ./js/index.jsx -o ./js/bundle.js  -t [ babelify --presets [ es2015 react ] ]
minify --output ./js/minbundle.js ./js/bundle.js
