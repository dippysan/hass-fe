export default {

  configName: '',
  hassUrl: '',
  buttonWidth: 180,
  buttonHeight: 180,
  backgroundImage: 1,
  screens: [{
    screenId: 'deb10b55-13f4-44ca-ab6d-ff2667456eb3',
    screenName: 'Screen 1',
    isHome: true,
    hagroups: [{
      id: '9ceb827f-2cf6-8c05-fc4a-10b88ba6c8bc',
      name: 'Empty',
      children: []
    }]
  }],
  configEnabled: false,
  componentsToDisplay: ['camera', 'climate', 'cover', 'group', 'light', 'sensors', 'switch', 'vacuum'],
  tempSensor: 'sensor.dark_sky_temperature',
  currentConditions: 'sensor.dark_sky_summary',
  homeScreenDelay: 10,
  rotateBackground: false,
  rotateBackgroundDelay: 10,
  rotateBackGroundImages: [0]
}
