
var LeafDoc = require('leafdoc');
var sander = require('sander');
var path = require('path');
var sandermatch = require('sandermatch');

function leafdoc ( inputdir, outputdir, options/*, callback */) {

	var doc = new LeafDoc(options),
	    files;

	if (!options.output) { options.output = 'leafdoc.html'; }
	
	if (options.files) {
		files = sander.lsr( inputdir );
	} else {
		files = sander.lsrMatch( inputdir, options.files );
	}
	
	return files.then( function(filenames) {
		for (var i in filenames) {
			doc.addFile(path.join(inputdir, filenames[i]), path.extname(filenames[i]) !== '.leafdoc');
		}
		return sander.writeFile(outputdir, options.output, doc.outputStr() );
	} );

}

module.exports = leafdoc;
