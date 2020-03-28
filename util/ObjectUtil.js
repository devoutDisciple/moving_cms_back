module.exports = {
	copy: (obj) => {
		let newObj = {};
		for(let key in obj) {
			newObj[key] = obj[key];
		}
		return newObj;
	},
	getName: function() {
		let str = "";
		let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		for(let i = 1; i <= 12; i++){
			let random = Math.floor(Math.random()*arr.length);
			str += arr[random];
		}
		return str;
	},
	isEmpty: function(obj) {
		return Object.keys(obj).length === 0;
	},
	deleteEmptyObject: function(obj) {
		for (var propName in obj) {
			if (obj[propName] === null || obj[propName] === undefined) {
				delete obj[propName];
			}
		}
		return obj;
	}
};
