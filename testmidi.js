(function(ext) {

	var m=null;
	var inputs=null;
	var input=null;
	var outputs=null;
	var output=null;
	var input_device=0;
	var output_device=0;

	navigator.requestMIDIAccess().then( success, failure );

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
    };

    ext.midiout = function(ch, note, vel) {
        m_midiout(ch, note, vel);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
      [' ', 'MIDI OUT %n %n %n', 'midiout', 10, 36, 80],
      ['-'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('MIDI extension', descriptor, ext);
})({});
