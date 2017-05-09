function prepareSchedule(json) {
  let schedules = '';
  ['1⃣', '2⃣', '3⃣'].forEach((cinema, index) => {
    schedules += json.show[`c${index + 1}`].reduce((sch, movie) =>
      `${sch}${movie.title} @ ${movie.showtime.gc}\n`, `\nCinema ${cinema}\n`);
  });
  return `🗓${json.meta.gc}🗓\n${schedules}`;
}

module.exports.prepareSchedule = prepareSchedule;
