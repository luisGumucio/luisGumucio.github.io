(function ($) {
	'use strict';
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCAh0OS2aoN3uK6Su2FsYYfBrrjcK_Z7eQ",
		authDomain: "bitalino-test.firebaseapp.com",
		databaseURL: "https://bitalino-test.firebaseio.com",
		projectId: "bitalino-test",
		storageBucket: "bitalino-test.appspot.com",
		messagingSenderId: "217778137158"
	};
	firebase.initializeApp(config);
	// Firebase Database Reference and the child
	const dbRef = firebase.database().ref();
	const usersRef = dbRef.child('pacients');
	const bitalino = dbRef.child('bitalino');
	const vitalino = dbRef.child('bitali');
	var interval =  null;
	const evaluationActive = dbRef.child('evaluation_active');
	var urlParams = new URLSearchParams(window.location.search);
	readParameter();
	//readBitalino();

	function readParameter() {
		var id = urlParams.getAll('id');
		alert(id);
		readUserData("-LDmLYqXfHivhgHffz7J");
	}

	function readUserData(id) {

		var ww = dbRef.child('pacients/' + id);

		ww.on("value", snap => {
			var pacient = snap.val();
			console.log(pacient);
			document.getElementById("nameH5").innerHTML = pacient.name + " " + pacient.lastName;
			document.getElementById("addressH5").innerHTML = pacient.address;
			document.getElementById("dateH5").innerHTML = formatDate(new Date());
			document.getElementById("historyH5").innerHTML = pacient.numberHistory;
		});
		readActiveEvaluation(id);
	}
	function readActiveEvaluation(id) {
		dbRef.child('evaluation_active/' + id).orderByChild("evaluation")
		.equalTo(false).on("child_added", function (snapshot) {
				clearInterval(interval)
			
			//readBitalino(snapshot.val().idEvaluation, id);
		});
		var active = dbRef.child('evaluation_active/' + id).orderByChild("evaluation")
			.equalTo(true).on("child_added", function (snapshot) {
				if(snapshot.val().idEvaluation != undefined) {
					readBitalino();
				} else {
					clearInterval(interval)
				}
				//readBitalino(snapshot.val().idEvaluation, id);
			});

	}

	function readBitalino() {
		 interval = setInterval(function () {
			$('.jke-ecgChart').ecgChart('addDataPoint', getDataPoint());
			}, interval);
		
		//bitalino.on("child_added", snap => {

			//snap.forEach(childSnap => {
			//console.log('new record', snapshot.key);
				//$('.jke-ecgChart').ecgChart('addDataPoint', getDataPoint());
			//});
		//})
	}
	var _data = [
		0, 0, 0, 0, 0.0000050048828125, 0.0000137939453125, 0.000049560546875, 0.00008740234375, 0.00015966796875,
		0.000262451171875, 0.0003975830078125, 0.0005687255859375, 0.0007802734375, 0.001037353515625,
		0.0013468017578125, 0.00172119140625, 0.0021756591796875, 0.0027232666015625, 0.0033880615234375,
		0.004206787109375, 0.0052380371093750005, 0.006586181640625, 0.008400146484375001, 0.010904296875,
		0.0144892578125, 0.0196798095703125, 0.049684204101562504, 0.0886883544921875, 0.11185363769531251,
		0.134164306640625, 0.137352294921875, 0.1160369873046875, 0.08516308593750001, 0.0539765625,
		0.014997436523437501, -0.015882568359375, -0.0387554931640625, -0.06125732421875, -0.0745780029296875,
		-0.07479357910156251, -0.0725338134765625, -0.0418538818359375, 0.08582861328125001, 0.397717529296875,
		0.8136408691406251, 1.2295617980957032, 0.9944150390625001, 0.2824605712890625, -0.38949267578125,
		-0.597251220703125, -0.425675537109375, -0.1537947998046875, -0.0500914306640625, -0.0111041259765625,
		0.0027451171875, 0.0071739501953125, 0.008443359375, 0.0094327392578125, 0.012530517578125,
		0.0176046142578125, 0.0300162353515625, 0.0433489990234375, 0.056962646484375004,
		0.0704832763671875, 0.0770511474609375, 0.0898175048828125, 0.10311853027343751, 0.117046142578125,
		0.1312630615234375, 0.1529300537109375, 0.167607177734375, 0.1899068603515625, 0.2124422607421875,
		0.235044677734375, 0.2575535888671875, 0.2724073486328125, 0.286978271484375, 0.3007579345703125,
		0.3067425537109375, 0.3106370849609375, 0.303756103515625, 0.2897236328125, 0.25916931152343753,
		0.2200599365234375, 0.1728209228515625, 0.133416259765625, 0.086224853515625, 0.05493408203125,
		0.02409423828125, 0.00922607421875, -0.0043409423828125, -0.0097349853515625, -0.013127685546875,
		-0.01423095703125, -0.013834716796875, -0.012556030273437501, -0.010675048828125, -0.00835888671875,
		-0.0057305908203125, -0.0000562744140625
	];

	// Create a data point generator.
	var getDataPoint = (function () {

		var _x = -1;
		var _max = _data.length;

		return function () {
			_x = (_x + 1) % _max;
			return { x: Date.now(), y: _data[_x] };
		};
	})();
	var heartRate = 60; // bpm
	var interval = 60 * 1000 / (_data.length * heartRate);
	console.log(interval);
	function formatDate(date) {
		var monthNames = [
			"Enero", "Febrero", "Marzo",
			"Abril", "Mayo", "Junio", "Julio",
			"August", "September", "October",
			"November", "December"
		];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;
	}

})($);
