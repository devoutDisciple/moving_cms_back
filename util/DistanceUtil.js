module.exports = {
	getDistance: (startSite, endSite) => {
		const d1 = 0.01745329251994329;
		const d2 = startSite.longitude * d1;
		const d3 = startSite.latitude * d1;
		const d4 = endSite.longitude * d1;
		const d5 = endSite.latitude * d1;
		const d6 = Math.sin(d2);
		const d7 = Math.sin(d3);
		const d8 = Math.cos(d2);
		const d9 = Math.cos(d3);
		const d10 = Math.sin(d4);
		const d11 = Math.sin(d5);
		const d12 = Math.cos(d4);
		const d13 = Math.cos(d5);
		const arrayOfDouble1 = [];
		const arrayOfDouble2 = [];
		arrayOfDouble1.push(d9 * d8);
		arrayOfDouble1.push(d9 * d6);
		arrayOfDouble1.push(d7);
		arrayOfDouble2.push(d13 * d12);
		arrayOfDouble2.push(d13 * d10);
		arrayOfDouble2.push(d11);
		const d14 = Math.sqrt(
			(arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
				(arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
				(arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]),
		);

		return Math.asin(d14 / 2.0) * 12742001.579854401;
	},
};
