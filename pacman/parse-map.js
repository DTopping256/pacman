const halfMap2dArray = rawHalfMapData.split('\n').map(line => line.split(''));

const processedHalfMap = halfMap2dArray.map(line => line.filter(char => !/^\s$/.test(char)))
                                       .filter(line => line.length > 0);
                                       
const getResetMap = () => processedHalfMap.map(line => [...line, ...[...line].reverse()]); 

const mapData = getResetMap();

const rows = mapData.length;
const columns = mapData[0].length;
