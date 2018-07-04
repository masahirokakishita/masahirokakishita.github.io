(function(ext) {

	var m=null;
	var inputs=null;
	var input=null;
	var outputs=null;
	var output=null;
	var input_device=0;
	var output_device=0;

	navigator.requestMIDIAccess( { sysex: true } ).then( success, failure );

	function success(midiAccess) {
		m=midiAccess;

		if (typeof m.inputs === "function") {
			inputs=m.inputs();
			outputs=m.outputs();
		} else {
			var inputIterator = m.inputs.values();
			inputs = [];
			for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
				inputs.push(o.value)
			}

			var outputIterator = m.outputs.values();
			outputs = [];
			for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
				outputs.push(o.value)
			}
		}
		console.log("You can use MIDI API!");
		console.log("input device=",inputs.length);
		console.log("output device=",outputs.length);
	}

	function failure(error) {
		console.log("MIDI API error");
	}

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    function m_midiout(ch, note, vel){
	console.log(ch,note,vel);
	var data1=0x90+((ch-1)&0x0F);
	var data2=note&0x7F;
	var data3=vel&0x7F;
	console.log(data1,data2,data3);

	if(outputs!=null){
		for(var i=0; outputs.length; i++){
			output=outputs[i];
			output.send([data1,data2,data3], 0);
		}
	}
    };

    ext.midiout = function(ch, note, vel) {
        m_midiout(ch, note, vel);
    };

	ext.testtext = function(ss){
		console.log(ss);
	}

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
      [' ', 'TEXT %s', 'testtext', 'aaa'],
      ['-'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('MIDI extension', descriptor, ext);
})({});
