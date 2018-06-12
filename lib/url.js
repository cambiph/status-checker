import dateFormat from 'dateformat';

export let urls = [
  'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant',
  'https://www.delijn.be/nl/haltes/halte/104716/Antwerpen_Premetrostation_Diamant#2',
  'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen',
  'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#dienstregeling',
  'https://www.delijn.be/nl/lijnen/lijn/1/500/6/500_Mechelen_-_Rumst_-_Boom_-_Antwerpen#omleidingen',
  'https://www.delijn.be/nl/routeplanner',
  'https://www.delijn.be/nl',
  'https://www.delijn.be/nl/kusttram/'
];

export async function addUrlToArray() {
  await urls.push(await getRoutePlannerUrl());
}

async function getRoutePlannerUrl() {
  return (
    'https://www.delijn.be/nl/routeplanner/resultaten.html?' +
    'from=Station+Antwerpen+Centraal+%5BB%5D' +
    '&startXCoordinaat=153657' +
    '&startYCoordinaat=211918' +
    '&to=Station+Mechelen+%5BB%5D' +
    '&finishXCoordinaat=158001' +
    '&finishYCoordinaat=189723' +
    '&datum=' +
    (await getDate())
  );
  +'&departureChoice=1' + '&tijd=' + (await getTime());
  +'&option-bus=on' +
    '&option-tram=on' +
    '&option-metro=on' +
    '&option-trein=on' +
    '&option-belbus=off';
}

async function getDate() {
  return dateFormat('dd-mm-yyyy');
}

async function getTime() {
  return dateFormat('HH:MM');
}
