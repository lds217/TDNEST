const express = require('express');
const app = express();
const db = require('./firestore');
const session = require('express-session');
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



////////////////CREATE EVENT/////////////////////////

// Your TIMEOFFSET Offset




// Get date-time string for calender
function createEvent(event){
    return {
      'id': event.uid,
      'summary': event.Name  ,
      'description': event.uid+'\n'+event.Name+ '\n' + event.number+ '\n'+ event.address +'\n' +event.datetime,
      'start': {
        'dateTime': event.startDate,
        'timeZone': 'Asia/Ho_Chi_Minh'
      },
      'end': {
        'dateTime': event.endDate,
        'timeZone': 'Asia/Ho_Chi_Minh'
      },
      'locked':true,
    };
  
};

const getEvents = async (dateTimeStart, dateTimeEnd) => {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Asia/Ho_Chi_Minh'
        });
    
        let items = response['data']['items'];
        return items;
};
////////////////////////////////////////////////////////


app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: true
}));

function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login.html');
  }
}

app.use(express.static('public'));
app.use(express.static('private'));
app.use(express.json());


app.post('/api/users', async (req, res) => {
  const snapshot = await db.collection('users').doc('xLTQL4qFRzfXRuFa52lX');
  const ad = await snapshot.get();
  let data = ad.data();
  const newData = req.body;
  let ok = 0;
  console.log(newData.Name, data.username,newData.Pass,data.password)
  if(newData.Name == data.username && newData.Pass == data.password)
  {
    req.session.user = newData.Name;
    console.log('hi');
    res.json(true);
  }
  else
   res.json(false);

});

app.post('/api/users', async (req, res) => {
  const snapshot = await db.collection('users').doc('xLTQL4qFRzfXRuFa52lX');
  const ad = await snapshot.get();
  let data = ad.data();
  const newData = req.body;
  let ok = 0;
  console.log(newData.Name, data.username,newData.Pass,data.password)
  if(newData.Name == data.username && newData.Pass == data.password)
  {
    req.session.user = newData.Name;
    console.log('hi');
    res.json(true);
  }
  else
   res.json(false);

});


app.post('/check', async (req, res) => {
  let ok =0;
  if (!req.session.user)
    {
      console.log('may chua dang nhap');
      res.json(ok);
      return;
    }
  req.session.user = "ok";
   ok=1;
    res.json(ok);
});

// app.post('/api/add-event-list', async (req, res) => {
//   let ok =0;
//   if (!req.session || !req.session.user)
//     {
//       console.log('may chua dang nhap');
//       res.json(ok);
//       return;
//     }
//   let data=req.body;
//   let startDate = data.startDate;
//   let endDate = data.endDate;
//   let response = await calendar.events.list({
//             auth: auth,
//             calendarId: calendarId,
//             timeMin: startDate,
//             timeMax: endDate,
//             timeZone: 'Asia/Ho_Chi_Minh'
//         });
    
//       let items = response['data']['items'];
//  // console.log(items);
//     res.json(items);
// });

app.post('/api/add-event-list', async (req, res) => {
  let ok =0;
  // if (!req.session.user)
  //   {
  //     console.log('may chua dang nhap');
  //     res.json(ok);
  //     return;
  //   }
  req.session.user = "ok";
  let event=req.body;
  let start=event.startDate;
  let end=event.endDate;
  
    const citiesRef = db.collection('data');
    const snapshot = await citiesRef.where('datetime', '>=', start).where('datetime', '<=', end).get();
  let items=[];
    snapshot.forEach((doc) => {
    items.push(doc.data());
});
 
  console.log(items);
    res.json(items);
});



app.post('/api/add-event', async (req, res) => {
  const newData = req.body;
  let event1 = createEvent(newData);
  calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event1
        });
  res.json(event1);
});

app.post('/api/data', async (req, res) => {
  const newData = req.body;
  const docRef = await db.collection('data').doc(newData.uid).set(newData);
  res.json({message: 'Data saved successfully', id: docRef.id});
});



const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});

