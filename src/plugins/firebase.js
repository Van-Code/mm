import firebase from 'firebase/app';
import 'firebase/database';

// Your web app's Firebase configuration
var config = {
	apiKey: 'AIzaSyAdsc0ugLoqcLu-oXd0oV8WfgQ9jfe8pXU',
	authDomain: 'mymag-polls.firebaseapp.com',
	databaseURL: 'https://mymag-polls.firebaseio.com',
	projectId: 'mymag-polls',
	storageBucket: 'mymag-polls.appspot.com',
	messagingSenderId: '626304851931',
	appId: '1:626304851931:web:a0bc83b436a3a35a6f11fe'
};
// Initialize Firebase
firebase.initializeApp(config);
export default firebase;
