/* -------------------------------------------------------------------------	*/
/* Web MIDI API Extension for ScratchX 											*/
/* (c)2016 Masahiro Kakishita													*/
/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/
/* -------------------------------------------------------------------------	*/

(function(ext) {

/* -------------------------------------------------------------------------	*/
/* for Web MIDI API */
/* -------------------------------------------------------------------------	*/
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

		for(var i=0; i<inputs.length; i++){
			inputs[i].onmidimessage = m_midiin;
		}
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

	var mCtlbuf = new Array(0x80);
	for(var i=0; i<0x80; i++) mCtlbuf[i]=0;

	/* MIDI parse */
	function m_midiin(event){
		console.log(event.data[0]);
		switch(event.data[0]&0xF0){
			case 0x80:
				break;
			case 0x90:
				break;
			case 0xA0:
				break;
			case 0xB0:
				mCtlbuf[event.data[1]]=event.data[2];
				break;
			case 0xC0:
				break;
			case 0xD0:
				break;
			case 0xE0:
				break;
			case 0xF0:
				break;
		}
	};

// Put MIDI
    ext.midiout = function(ch, note, vel) {
        m_midiout(ch, note, vel);
    };

// PUT CC
// ccnum: Control Change Number
	ext.ccin = function(ccnum) {
		return (mCtlbuf[ccnum]);
	};

// GET NOTE ON
	var alarm_went_off = false;
	ext.noteonin = function() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (alarm_went_off === true) {
			alarm_went_off = false;
			return true;
       }
       return false;
	};

	// Block and block menu descriptions
	var descriptor = {
		blocks: [
			[' ', 'PUT MIDI %n %n %n', 'midiout', 10, 36, 80],
			['r', 'GET CC %n', 'ccin',30],
			['h', 'GET NOTE ON %n', 'noteonin',30],
			['-'],
		]
	};

    // Register the extension
    ScratchExtensions.register('Web MIDI API extension', descriptor, ext);
})({});
