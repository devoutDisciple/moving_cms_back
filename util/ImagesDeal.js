// const images = require("images");
const fs = require("fs");
const gm = require("gm");
let num = 1;

module.exports = {
	dealImages: async function(filePath) {
		try {
			const self = this;
			fs.stat(filePath, (err, status) => {
				let size = Number.parseInt(Number(status.size) / 1024);
				if(size <= 120) {
					num = 1;
					return;
				}
				if(size >= 120) {
					num++;
					if(num > 15) {
						num = 1;
						return clearTimeout(global.timer_myself);
					}
					if(num < 5) {
						try {
							gm(filePath).size(function(error) {
								if(error) return console.log(error);
								gm(filePath)
									.resize(1350, 1000)
									.noProfile()
									.write(filePath, function (error) {
										if (error) return console.log(error);
										self.dealImages(filePath);
									});
							});
						} catch (error) {
							if(error) return console.log(error);
							fs.exists(filePath, () => {
								fs.unlinkSync(filePath);
							});

						}
					}
					if(num >= 5 && num < 10) {
						try {
							gm(filePath).size(function(error, value) {
								if(error) return console.log(error);
								gm(filePath)
									.resize(value.width - 200, value.height - 200)
									.noProfile()
									.write(filePath, function (error) {
										if (error) {
											console.log(error);
											return;
										}
										self.dealImages(filePath);
									});
							});
						} catch (error) {
							console.log(error);
							fs.exists(filePath, () => {
								fs.unlinkSync(filePath);
							});
						}
					}
					if(num >= 10) {
						try {
							gm(filePath).size(function(error, value) {
								if(error) return console.log(error);
								gm(filePath)
									.resize(value.width - 500, value.height - 500)
									.noProfile()
									.write(filePath, function (error) {
										if (error) {
											console.log(error);
											return;
										}
										self.dealImages(filePath);
									});
							});
						} catch (error) {
							fs.exists(filePath, () => {
								fs.unlinkSync(filePath);
							});
							console.log(error);
						}
					}

				}
			});
		} catch (error) {
			console.log(error);
		}
	}
};
