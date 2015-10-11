{
	var client;							// MQTT�̃N���C�A���g�ł�
	var clientId = "clientid";			// ClientID���w�肵�܂��B
	var connectflag=0;

	function connect(){
		var user_name = "masahirokakishita@github";
		var pass = "UtlX750a62h1PmK3";
		var wsurl = "ws://lite.mqtt.shiguredo.jp/mqtt";
		var number = Math.floor(256*Math.random());
		clientId+=String(number);

		// WebSocketURL��ClientID����MQTT Client���쐬���܂�
		client = new Paho.MQTT.Client(wsurl, clientId);

		// connect���܂�
		client.connect({userName: user_name, password: pass, onSuccess:onConnect, onFailure: failConnect});
	}

	// �ڑ������s������Ăяo����܂�
	function failConnect(e) {
		console.log("connect failed");
		console.log(e);
	}

	// �ڑ��ɐ���������Ăяo����܂�
	function onConnect() {
		console.log("onConnect");
		log.innerText += "onConnect";
		log.innerText +="\n";

		log.innerText +="start of subscribe\n";
		subscribe();
		log.innerText +="end of subscribe\n";

		connectflag=1;
	}

 	// ���b�Z�[�W������������Ăяo�����R�[���o�b�N�֐�
 	function onMessageArrived(message) {
		console.log("onMessageArrived:"+message.payloadString);

		log.innerText += "onMessageArrived:";
		log.innerText += message.payloadString
		log.innerText +="\n";
		
		var i=0;
		var str=null;
		var message=message.payloadString;
		var note = parseInt(message, 10);
		fsend(note);

	}

	function subscribe(){
		// �R�[���o�b�N�֐���o�^���܂�
		client.onMessageArrived = onMessageArrived;

		var topic = "masahirokakishita@github/midi";
		//var topic = "testtest";
		// Subscribe���܂�
		client.subscribe(topic);
	}

	function publish(){
		var topic = "masahirokakishita@github/midi";
		//	var topic = "testtest";

		log.innerText +="start of publish\n";
		message = new Paho.MQTT.Message("Hello");
		message.destinationName = topic;
		client.send(message);
		log.innerText += "sendMessage:";
		log.innerText += message.payloadString
		log.innerText +="\n";
	}

	function publishmidi(data1){
		var topic = "masahirokakishita@github/midi";
		//	var topic = "testtest";

		log.innerText +="start of publish\n";

		var str = data1.toString(10);

		message = new Paho.MQTT.Message(str);
		message.destinationName = topic;
		client.send(message);

		log.innerText += "sendMessage:";
		log.innerText += message.payloadString
		log.innerText +="\n";
	}
}

