// uses GoogleAuth
// dali da ova klasa vrati promise?
//   pda.
// dali onda da damo taj promise api-u?
//   pitanje je tko ga zeli resolvat, mi ili api.
//   bolje da ga mi resolvamo jer onda mozemo ne pozvat api uopce.
voronoi.Auth = function (
    log,
    $authDiv,
    $signInButton,
    $revokeAccessButton,
    $authStatus
    ) {

  // The promise callbacks for getIdToken.
  var resolve = null;
  var reject = null;

  // Returns a promise that resolves into an id_token if the user is
  // authenticated successfully.
  // This is actually never rejected.
  this.getIdToken = function() {
    return new Promise(function (_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
      handleClientLoad();
    });
  };

  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

  function initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': voronoi.config.oauth.api_key,
        'discoveryDocs': [discoveryUrl],
        'clientId': voronoi.config.oauth.client_id,
        'scope': voronoi.config.oauth.scope
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $signInButton.click(function() {
        handleAuthClick();
      }); 
      $revokeAccessButton.click(function() {
        revokeAccess();
      }); 
    });
  }

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(voronoi.config.oauth.scope);
    if (isAuthorized) {
      $authDiv.hide();
      $signInButton.html('Sign out');
      $revokeAccessButton.css('display', 'inline-block');
      $authStatus.html(
          'You are currently signed in and have granted ' +
          'access to this app.');
      resolve(user.getAuthResponse().id_token);
      return true;
    } else {
      $authDiv.show();
      $signInButton.html('Sign In/Authorize');
      $revokeAccessButton.css('display', 'none');
      $authStatus.html(
          'You have not authorized this app or you are ' +
          'signed out.');
    }
  }
};
