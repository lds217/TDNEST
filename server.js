////////////////////////////////////////////////////////
const {google} = require('googleapis');

// Provide the required configuration
const CREDENTIALS = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
}
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

////////////////////////////////////////////////////////
const express = require('express');
const app = express();
const db = require('./firestore');
//const { insertEvent } = require('./calendar');

var event = {
            'summary': 'Bin đặt yến',
            'description': 'Bin đặt 1 hũ yến',
            'start': {
                'dateTime': '2024-03-20T09:00:00+07:00',
                'timeZone': 'Asia/Ho_Chi_Minh'
            },
            'end': {
                'dateTime': '2024-03-20T09:30:00+07:00',
                'timeZone': 'Asia/Ho_Chi_Minh'
            }
          };

app.use(express.static('public'));

app.use(express.json());

// app.get('/api/data', async (req, res) => {
//   const snapshot = await db.collection('data').get();
//   const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
//   res.json(data);
// });

app.post('/api/add-event', async (req, res) => {
    const eventData = req.body;
    const event = await insertEvent(event);
    res.json(event);
});

app.post('/api/data', async (req, res) => {
  const newData = req.body;
  const docRef = await db.collection('data').add(newData);
  calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
  res.json({message: 'Data saved successfully', id: docRef.id});
});



const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});

