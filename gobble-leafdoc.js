/*

🦃namespace leafdoc

Build documentation with [Leafdoc](https://github.com/Leaflet/Leafdoc) docstrings

🦃example

```javascript
module.exports = gobble( 'src' ).transform( 'leafdoc', {
output: 'documentation.html',
templateDir: 'assets/custom-leafdoc-templates',
leadingCharacter: '@'
});
```

🦃option templateDir: String = 'templates/basic'
Location of the Leafdoc templates to be used, relative to the gobblefile.

🦃option showInheritancesWhenEmpty: Boolean = false
When `true`, child classes/namespaces will display documentables from ancestors, even if the child class doesn't have any of such documentables.

🦃option leadingCharacter: String = '🍂'
Overrides the leaf symbol as the leading character for docstrings.

🦃option customDocumentables: Map = {}
An optional key-value map, each pair will be passed to Leafdoc's `registerDocumentable`.

🦃option verbose: Boolean = false
When `true`, output some info about files being processed.

*/

var LeafDoc = require('leafdoc');
var sander = require('sander');
var path = require('path');
var sandermatch = require('sandermatch');

function leafdoc ( inputdir, outputdir, options/*, callback */) {
	var doc = new LeafDoc(options),
	    files;

	// 🦃option output: String = 'leafdoc.html'
	// The filename where the documentation will be written to.
	if (!options.output) { options.output = 'leafdoc.html'; }
	
	// 🦃option files: Minimatch = undefined
	// An optional [Minimatch](https://github.com/isaacs/minimatch) expression (or
	// an array of minimatch expressions) to filter the files by. Works like the
	// built-in `include` gobble transform, but keeps the order, so this can be
	// used for leading/trailing content:
	// ```javascript
	// module.exports = gobble( 'src' ).transform( 'leafdoc', {
	// 	output: 'documentation.html',
	// 	files: [
	// 	'first-very-important-thing.leafdoc',
	// 	'**/*.js',
	// 	'credits.leafdoc'
	// 	]
	// });
	// ```
	if (options.files) {
		files = sandermatch.lsrMatch( inputdir, options.files );
	} else {
		files = sander.lsr( inputdir );
	}
	
	return files.then( function(filenames) {
		filenames.forEach(function(filename) {
			doc.addFile(path.join(inputdir, filename), path.extname(filename) !== '.leafdoc');
		})
		
		return sander.writeFile(outputdir, options.output, doc.outputStr() );
	} );

}

module.exports = leafdoc;
