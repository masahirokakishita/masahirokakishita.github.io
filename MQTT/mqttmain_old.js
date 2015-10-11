{
	var client;							// MQTTのクライアントです
	var clientId = "clientid";			// ClientIDを指定します。
	var connectflag=0;

	function connect(){
		var user_name = "masahirokakishita@github";
		var pass = "UtlX750a62h1PmK3";
		var wsurl = "ws://lite.mqtt.shiguredo.jp/mqtt";
		var number = Math.floor(256*Math.random());
		clientId+=String(number);

		// WebSocketURLとClientIDからMQTT Clientを作成します
		client = new Paho.MQTT.Client(wsurl, clientId);

		// connectします
		client.connect({userName: user_name, password: pass, onSuccess:onConnect, onFailure: failConnect});
	}

	// 接続が失敗したら呼び出されます
	function failConnect(e) {
		console.log("connect failed");
		console.log(e);
	}

	// 接続に成功したら呼び出されます
	function onConnect() {
		console.log("onConnect");
		log.innerText += "onConnect";
		log.innerText +="\n";

		log.innerText +="start of subscribe\n";
		subscribe();
		log.innerText +="end of subscribe\n";

		connectflag=1;
	}

 	// メッセージが到着したら呼び出されるコールバック関数
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
		// コールバック関数を登録します
		client.onMessageArrived = onMessageArrived;

		var topic = "masahirokakishita@github/midi";
		//var topic = "testtest";
		// Subscribeします
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

