function nextTimeFromNow(headwayMin = 3) {
  if (typeof headwayMin !== 'number' || headwayMin <= 0){
    throw new Error('Invalid headway');
  } {
	const now = new Date();
	const next = new Date(now.getTime() + headwayMin * 60 * 1000);
	const hh = String(next.getHours()).padStart(2, '0');
	const mm = String(next.getMinutes()).padStart(2, '0');
	return `${hh}:${mm}`;
}}
module.exports = { nextTimeFromNow };
