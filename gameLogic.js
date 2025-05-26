function canMove(fromTower, toTower) {
  if (fromTower.length === 0) return false;
  const movingDisk = fromTower[fromTower.length - 1];
  if (toTower.length === 0) return true;
  const topToDisk = toTower[toTower.length - 1];
  return movingDisk < topToDisk;
}

function checkWin(towers, diskCount) {
  return towers[1].length === diskCount || towers[2].length === diskCount;
}
