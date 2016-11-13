/* -------------------------------------------------------------------------	*/
/* Game Pad API Extension for ScratchX 											*/
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

	var pad=null;

	function runAnimation()
	{
		window.requestAnimationFrame(runAnimation);
	    var gamepad_info = '';
		var gamepads = navigator.getGamepads();
		var gamepad_num =gamepads.length;
		pad = new Array(gamepad_num);

		for (var i=0; i<gamepad_num; i++) {
			if(gamepads[i]!=null) pad[i] = gamepads[i];
		}
	}

	window.requestAnimationFrame(runAnimation);

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
//        m_midiout(ch, note, vel);
    };

/* -------------------------------------------------------------------------	*/
// BUTTON X- Y- A- B-
	ext.s_getXbtn = function() {
		return pad[0].buttons[2].pressed;
	};

	ext.s_getYbtn = function() {
		return pad[0].buttons[3].pressed;
	};

	ext.s_getAbtn = function() {
		return pad[0].buttons[0].pressed;
	};

	ext.s_getBbtn = function() {
		return pad[0].buttons[1].pressed;
	};

//Set Value
	ext.s_Xval = function() {
		return (pad[0].buttons[2].value);
	};

	ext.s_Yval = function() {
		return (pad[0].buttons[3].value);
	};

	ext.s_Aval = function() {
		return (pad[0].buttons[0].value);
	};

	ext.s_Bval = function() {
		return (pad[0].buttons[1].value);
	};


/* -------------------------------------------------------------------------	*/
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
//			[' ', 'AAA MIDI %n %n %n', 'midiout', 10, 36, 80],
			['h', 'X-Button', 's_getXbtn'],
			['h', 'Y-Button', 's_getYbtn'],
			['h', 'A-Button', 's_getAbtn'],
			['h', 'B-Button', 's_getBbtn'],

			['r', 'X-Val', 's_Yval'],
			['r', 'Y-Val', 's_Yval'],
			['r', 'A-Val', 's_Aval'],
			['r', 'B-Val', 's_Bval'],

//			['r', 'CC %n', 's_ccin',30],
//			['h', 'GET NOTE ON', 's_getnoteon'],
//			['h', 'KEY ON', 's_getkeyon'],
//			['h', 'KEY OFF', 's_getkeyoff'],
//			['r', 'NOTE', 's_note'],
//			['r', 'VEL', 's_vel'],
			['-'],
		]
	};

    // Register the extension
    ScratchExtensions.register('GAME PAD API extension', descriptor, ext);
})({});

