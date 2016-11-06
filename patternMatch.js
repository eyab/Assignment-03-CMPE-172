/*	Pattern Match: A command line app with Node.js Transform stream
*/                              
var program = require("commander"); 
var fileSystem = require("fs");
var Transform = require('stream').Transform;
var util = require( "util" );
 
if (!Transform) {
  Transform = require('readable-stream/transform');
}

function escapeRegExp(data){
	var newStr = data.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return newStr;
}

//parse chuncks
function PatternMatch( pattern ) {
  if (!(this instanceof PatternMatch )){
        return( new PatternMatch( pattern ) );
  }

  Transform.call( this,
  {objectMode: true} 
  );
  
  if (!(pattern instanceof RegExp)){ //Check pattern is an instance of PatternMatch
    pattern = new RegExp(escapeRegExp(pattern), "i");
  }

  this._pattern = pattern; // another copy of pattern
  this._inputBuffer = "";
}

util.inherits(PatternMatch, Transform);

PatternMatch.prototype._transform = function (chunk, encoding, getNextChunk){
  this._inputBuffer += chunk;
  var match = this._pattern.exec(this._inputBuffer);

  while (match) {
    var result = this._inputBuffer.substring(0, match.index);
    this._inputBuffer = this._inputBuffer.substring(match.index+1, this._inputBuffer.length);
    this.push(result.trim());
    //next match.
    match = this._pattern.exec(this._inputBuffer);
  }

  getNextChunk();
}

PatternMatch.prototype._flush = function(flushCompleted){ // flush method after stream has read file
  this.inputBuffer = "";
  this.push(null);
  flushCompleted();

}

program
       .option('-p, --pattern <pattern>', 'Input Pattern such as . ,') // correct pattern . ,
       .parse(process.argv);
                                     
var inputStream = fileSystem.createReadStream( "input-sensor.txt" );

// find matches                                           
patternStream.on("readable",function() {
    var content = null;
    while ( content = this.read()){
      matches.push(content);
    }
  }
);
patternStream.on("end", function() {
  console.log(matches);
}
);
