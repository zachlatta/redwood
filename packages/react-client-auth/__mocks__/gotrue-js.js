export default class GoTrueJSMock {
  currentUser = () => {
    console.log('pew')
    return { username: 'peterp' }
  }

  settings = async () => ({})
}
