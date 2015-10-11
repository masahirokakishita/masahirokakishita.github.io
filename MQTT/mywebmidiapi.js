// 2014.3.01 Chrome のWeb MIDI APIを使うために変更
// 2013.9.14 バルクダンプを受け取るために、sysexをONにした

{
	var m=null;
	var inputs=null;
	var input=null;
	var outputs=null;
	var output=null;
	var input_device=0;
	var output_device=0;
	var log=null;

	var time_interval=0;
	var timerId=null;
	var input_menu_id=null;
	var output_menu_id=null;
	var notes=[0x28, 0x2a, 0x2c, 0x2d, 0x2f, 0x31, 0x33, 0x34];

	var note_on_num=-1;	//Just sound note number

	function runTest()
	{
		if (!log)
			log = document.getElementById("log");
		navigator.requestMIDIAccess().then( success, failure );
	}

	function runTest2()
	{
		if (!log)
			log = document.getElementById("log");
		navigator.requestMIDIAccess( { sysex: true } ).then( success, failure );
	}

	function success(midiAccess)
	{
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

		alert( "OK MIDI API" );
		if(input_menu_id!=null) setInputDeviceSelect();
		if(output_menu_id!=null) setOutputDeviceSelect();
	}

	function failure(error)
	{
		alert( "NG MIDI API" )
	}

	function goSound(value){
		if(outputs==null) {
			alert( "NG MIDI API");
 			clearInterval(timerId);
			return;
		} else {
			if(output==null) output=outputs[output_device];
//			output=m.getOutput(0);
			output.send( [0x90, value, 0x7f] );
			output.send( [0x90, value, 0x00],window.performance.now()+1000.0);
		}
	}

	function soundChange(parts){
		var value=0;
		if(outputs==null) alert( "NG MIDI API" );
		if(output==null) output=outputs[output_device];
		value = parts.options[parts.selectedIndex].value;
		output.send( [0xC0, value] );
	}

	function continueSound(){
		continueSoundSub();
	}

	function continueSoundSub(){
		var i=0;
		timerId=setInterval(function(){
			goSound(notes[i]);
		i++;
		if(i>=notes.length) { i=0; }
		}, 500);
	}

	function outMessage(data1,data2,data3)
	{
		if(output!=null) output.send([data1,data2,data3], 0);
	}

	function outMessage3(data1,data2,data3)
	{
		if(output!=null) output.send([data1,data2,data3], 0);
	}

	function outMessage2(data1,data2,data3)
	{
		if(output!=null) output.send([data1,data2], 0);
	}

	function outSysEx(data,length)
	{
		var sysdata=Array(length+2);
		sysdata[0]=0xF0;
		for(var i=0; i<length; i++){
			sysdata[i+1]=data[i];
		}
		sysdata[length+1]=0xF7;
		if(output!=null) output.send(sysdata, 0);
	}

	function stopSound(){
		output.send([0xb0,  0x78, 0x00], 0);
		clearInterval(timerId);
	}



	function setOutputMenuID(parts)
	{
		output_menu_id = parts;
	}

	function setOutputDeviceSelect(){
		var i=0;
		if(m!=null){
			//--- 使用可能なデバイスの名前をメニューに設定する ---
			if(outputs.length>0){
				for(i=0; i<outputs.length; i++)
					output_menu_id.options[i+1] = new Option(outputs[i].name, i+1);
			}
			output_menu_id.value=1;
			output_device=0;
			output=outputs[output_device];

		}

	}


	function setInputMenuID(parts)
	{
		input_menu_id = parts;
	}

	function setInputDeviceSelect(){
		var i=0;
		if(m!=null){
			//--- 使用可能なデバイスの名前をメニューに設定する ---
			if(inputs.length>0){
				for(i=0; i<inputs.length; i++)
					input_menu_id.options[i+1] = new Option(inputs[i].name, i+1);
			}
		} 
	}

	function inputDeviceSelect(item){
		input_device = item.options[item.selectedIndex].value-1;
		if(input_device==-1) input_device=0;

		log.innerText +="input_device=";
		log.innerText += input_device;
		log.innerText +="\n";

		input= inputs[input_device];			//add for Page 18, MIDI message monitor
		input.onmidimessage = handleMIDIMessage1; 	//add for Page 18, MIDI message monitor

//		input._inLongSysexMessage=true;
//		input.addEventListener( "midimessage", handleMIDIMessage1 );
	}

	function outputDeviceSelect(item){
		output_device = item.options[item.selectedIndex].value-1;
		if(output_device==-1) output_device=0;
		output=outputs[output_device];
		log.innerText +="output_device=";
		log.innerText += output_device;
		log.innerText +="\n";
	}

//add for Page 18, MIDI message monitor
	function handleMIDIMessage1( event ) {
	var str=null;
	var i,k;

	if( event.data[0] ==0xFE ) return;

	if( event.data.length>1) {
		str ="data.length=" +event.data.length+ ":"+ " 0x" + event.data[0].toString(16) + ":";
		log.innerText += str;

		for(i=1,k=0; i<event.data.length; i++, k++){
				str =" 0x" + event.data[i].toString(16) + ":";
				log.innerText += str;
				if(i%8==0){
					log.innerText +="\n";
				}
			}
		}
		str ="\n"; log.innerText += str;
	}

	function goSysextest()
	{
		var sysex=[0xF0, 0x43, 0x40, 0x03, 0x03, 0xF7];
//		var sysex2=[0x03, 0xF7];
//		var sysex=[0xF0, 0x43, 0xF7];
        var now=window.performance.now();
		output.send(sysex,now+100);
//        now=window.performance.now();
//		output.send(sysex2,now+100);

	}
//--- End
}

