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

		if(m.inputs.size==0) failure();

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
		alert( "MIDI API NG\nPlease reload this page.");
	}

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

	var mCC_change_event=false;
	var mCtlbuf = new Array(0x80);
	for(var i=0; i<0x80; i++) mCtlbuf[i]=0;
	var mNote_on_event = false;
	var mKey_on_event = false;
	var mKey_off_event = false;
	var mNoteNum = 0;
	var mNoteVel = 0;
	var mNoteBuf = 0;

	/* MIDI parse */
	function m_midiin(event){
		console.log(event.data[0]);
		switch(event.data[0]&0xF0){
			case 0x80:
				m_noteon(event.data[1],0);
				break;
			case 0x90:
				m_noteon(event.data[1],event.data[2]);
				break;
			case 0xA0:
				break;
			case 0xB0:
				mCC_change_event=true;
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

	function m_noteon(note, vel)
	{
		mNote_on_event = true;
		mNoteNum=note;
		mNoteVel=vel;

		if(vel>0){
			mKey_on_event = true;
		} else {
			mKey_off_event = true;
		}
	}

/* -------------------------------------------------------------------------	*/
/* for Scratch Extension  */
/* -------------------------------------------------------------------------	*/
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

// Put MIDI
    ext.midiout = function(ch, note, vel) {
        m_midiout(ch, note, vel);
    };

/* -------------------------------------------------------------------------	*/
// GET CC
	ext.s_getcc = function() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mCC_change_event === true) {
			mCC_change_event = false;
			return true;
       }
       return false;
	};


// Set CC Value
// ccnum: Control Change Number
	ext.s_ccin = function(ccnum) {
		return (mCtlbuf[ccnum]);
	};

/* -------------------------------------------------------------------------	*/
// GET NOTE ON
	ext.s_getnoteon = function() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mNote_on_event === true) {
			mNote_on_event = false;
			return true;
       }
       return false;
	};

// GET KEY ON
	ext.s_getkeyon = function() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mKey_on_event === true) {
			mKey_on_event = false;
			return true;
       }
       return false;
	};

// GET KEY OFF
	ext.s_getkeyoff = function() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mKey_off_event === true) {
			mKey_off_event = false;
			return true;
       }
       return false;
	};

//Set Note Number
	ext.s_note = function() {
		return (mNoteNum);
	};

//Set Note Vel
	ext.s_vel = function() {
		return (mNoteVel);
	};

/* -------------------------------------------------------------------------	*/
	// Block and block menu descriptions
	var descriptor = {
		blocks: [
			[' ', 'PUT MIDI %n %n %n', 'midiout', 10, 36, 80],
			['h', 'GET CC', 's_getcc'],
			['r', 'CC %n', 's_ccin',30],
			['h', 'GET NOTE ON', 's_getnoteon'],
			['h', 'KEY ON', 's_getkeyon'],
			['h', 'KEY OFF', 's_getkeyoff'],
			['r', 'NOTE', 's_note'],
			['r', 'VEL', 's_vel'],
			['-'],
		]
	};

    // Register the extension
    ScratchExtensions.register('Web MIDI API extension', descriptor, ext);
})({});
