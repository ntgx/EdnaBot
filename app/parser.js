function prepareSchedule(json){
	let schedules = '';
	['1⃣','2⃣','3⃣'].forEach((cinema, index) => {
		schedules = schedules + json.show['c' + (index + 1)].reduce((sch, movie) => {
			sch = sch + `${movie.title} @ ${movie.showtime.gc}\n`
			return sch
		}, `\nCinema ${cinema}\n`)
	})

	return `🗓${json.meta.gc}🗓\n${schedules}`
}

module.exports.prepareSchedule = prepareSchedule