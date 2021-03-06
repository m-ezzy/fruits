class Chats extends Chats_Groups {
	constructor(who) {
		super(who);
	}
	load() {
		super.load();
	}
	load_data() {
		super.load_data();
	}
	async search() {
		let s = Content.ts.value;
		if(s == "") {
			return;
		}
		console.log(s);
	
		do_amazing_animation("35vw", "0vh", "5vw", "10vh");
	
		Content.sr.innerHTML = "";
		Content.sr.style.visibility = "visible";
	
		let pre = [];
		for (let i=0 ; i<this.previous.length ; i++) {
			let un = this.previous[i].user_name.search(s);
			let fn = this.previous[i].first_name.search(s);
			let ln = this.previous[i].last_name.search(s);
	
			console.log(un + fn + ln);
	
			if (un != -1 || fn != -1 || ln != -1) {
				pre.push(this.previous[i]);
			}
		}
		if (pre.length) {
			//add banner showing already created chats
			Content.sr.appendChild(create_div("chat", "", "", "your previous " + this.who));
		}
		for (let i = 0 ; i < pre.length ; i++) {
			let img = document.createElement("img");
			img.src = pre[i].extension ? "data/profile_pictures/" + pre[i].user_name + "." + pre[i].extension : this.place_holder;
	
			let oc = this.who + ".take_to_that_conversation(this,'" + pre[i].user_name + "')";
			let text = pre[i].user_name + " " + pre[i].first_name + " " + pre[i].last_name;
			let temp = create_div("chat", "", oc, text);
	
			temp.appendChild(img);
			Content.sr.appendChild(temp);
		}
	
		console.log("503");
		console.log(s);
	
		do_amazing_animation("25vw", "0vh", "5vw", "10vh");
	
		let response = await fetch("src/php/" + this.who + "/search.php?q=" + s, {method: 'POST', mode: 'no-cors', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: ''});
		let result = await response.json();
	
		if (result.length) {
			//add banner showing chats with whom no previous communication
			Content.sr.appendChild(create_div("chat", "", "", "start a new chat"));
		}
		result.forEach(r => {
			let img = document.createElement("img");
			img.src = r.extension ? "data/profile_pictures/" + r.user_name + "." + r.extension : this.place_holder;
	
			let oc = "chats.create_new('" + r.user_name + "','" + r.first_name + "','" + r.last_name + "','" + r.extension + "')";
			let text = r.user_name + " " + r.first_name + " " + r.last_name;
			let temp = create_div("chat", "", oc, text);
			//temp.onclick = oc;
	
			temp.appendChild(img);
			Content.sr.appendChild(temp);
		});
	
		if (pre.length == 0 && result.length == 0) {
			//SR.innerHTML = "<div class='chat'> no such user found </div>";
			Content.sr.appendChild(create_div("chat", "", "", "no such user found"));
		}
	}
	async create_new(user_name, first_name, last_name, extension) {
		Content.sr.style.visibility = "hidden";
	
		const response = await fetch("src/php/" + this.who + "/create_new.php", {method: 'POST', mode: 'no-cors', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: 'user_name=' + user_name});
		let data = await response.text();
	
		this.previous.push({user_name: (user_name), first_name: (first_name), last_name: (last_name), extension: (extension), rows: -1});
	
		let src = extension != 'null' ? "data/profile_pictures/" + user_name + "." + extension : this.place_holder;
		let img = create_image('', '', '', src, Common.w, Common.h);
		let div = create_div("new_media_indicator", "", "", "");
	
		let oc = this.who + ".show_conversation(this, '" + user_name + "')";
		let text = user_name + " " + first_name + " " + last_name;
		let temp = create_div("chat", "", oc, text);
	
		temp.appendChild(img);
		temp.appendChild(div);
		this.pl.appendChild(temp);
	
		this.element.appendChild(create_div("conversation", this.who + "_" + user_name, "", ""));
		//let e = document.getElementById(this.who + "_" + user_name);
		//this.conversation.push(e);
		this.conversation = this.element.getElementsByClassName('conversation');
		//let y = chats.element.getElementsByClassName("conversation")[chats.previous.length];
	
		this.show_conversation(this.pl.lastElementChild, user_name);
	}
	async check_for_new() {
		if (this.loaded == 0) {
			return;
		}

		const response = await fetch("src/php/" + this.who + "/check_for_new.php", {method: 'POST', mode: 'no-cors', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: ''});
		let data = await response.json();

		if (data[0] == 0) {
			return;
		}

		this.create_new(data.user_name, data.first_name, data.last_name, data.extension);
	}
}
