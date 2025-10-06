function getNextArrival(headwayMin = 3) {
  if (typeof headwayMin !== 'number' || headwayMin <= 0) {
    throw new Error('Invalid headway');
  }

  const now = new Date();
  now.setMinutes(now.getMinutes() + headwayMin);

  return now.toTimeString().slice(0, 5);
}
module.exports = { getNextArrival };