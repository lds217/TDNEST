const express = require('express');
const app = express();
const db = require('./firestore');
const session = require('express-session');
////////////////////////////////////////////////////////
const {google} = require('googleapis');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
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

const cache = require('./routeCache');

// Get date-time string for calender
function createEvent(event){
  let color;
  if(event.status=="Ordered")
      color="8";
  else
    if(event.status=="Confirmed")
        color="7";
    else
        color="11";
    return {
      'colorId': color,
      'id': event.uid,
      'summary': event.Name  ,
      'description': event.uid+'\n'+event.Name+ '\n' + event.number+ '\n'+ event.address +'\n' +event.datetime + '\n' + event.otherCaption + '\n' + event.status,
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

////////////////////////////////////////////////////////
///////Limit rate
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs:  60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: function(req /*, res */) {
    return req.ip; 
  }
});


app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: true
}));



app.use(express.static('public'));
app.use(express.static('private'));
app.use(express.json());


app.get('/admin', (req, res) => {
  if (req.session.user) {

    res.sendFile(__dirname+ '/admin.html');
  } else {
    res.redirect('/login'); // Redirect to login page if not logged in
  }
});

app.get('/checkAuth', (req, res) => {
  // Check if user is logged in
  if (req.session.user) {
    res.sendStatus(200); // User is authenticated
  } else {
    res.sendStatus(401); // User is not authenticated
  }
});

app.get('/login', async (req, res) => {
  // Authentication logic
  res.sendFile(__dirname+ '/login.html');
});

app.post('/logincheck',limiter, async (req, res) => {
  // Authentication logic
  const snapshot = await db.collection('users').doc('xLTQL4qFRzfXRuFa52lX');
  const ad = await snapshot.get();
  let data = ad.data();
  const newData = req.body;
  let ok = 0;
  console.log(newData.Name, data.username,newData.Pass,data.password)
  if(newData.Name == data.username && newData.Pass == data.password)
  {
      
     req.session.user = newData.Name; // Store user information in session
    res.redirect('/admin'); // Redirect to dashboard or any authenticated page
  } else {
    res.status(401).send('Invalid credentials');
  }
});




  ///////////////////////////////////////////////////
 //          THIS AREA IS FOR MY MEO MEO          //
///////////////////////////////////////////////////




app.post('/api/add-event-list',limiter, async (req, res) => {
  
  let event=req.body;
  let start=event.startDate;
  let end=event.endDate;
  
    const citiesRef = db.collection('data');
    const snapshot = await citiesRef.where('datetime', '>=', start).where('datetime', '<=', end).get();
  let items=[];
    snapshot.forEach((doc) => {
    items.push(doc.data());
});
 
  //console.log(items);
    res.json(items);
});
const crypto = require('crypto');

function uuidv4() {
  return '2107200505062006'.replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
  );
}

app.post('/api/add-event',limiter, async (req, res) => {
  
  const newData = req.body;
  newData.uid = newData.number + uuidv4() +"l";
  
  const docRef = await db.collection('data').doc(newData.uid).set(newData);
  let event1 = createEvent(newData);
  test=calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event1
        });
  res.json(newData);
});

app.post('/api/delete-event', async (req, res) => {
  const newData = req.body;
  console.log(newData);
 await db.collection('data').doc(newData.uid).delete();
  await calendar.events.delete({
  auth: auth,
  calendarId: calendarId,
  eventId: newData.uid,
  });
  res.json(newData);
});


app.post('/api/delete-prod', async (req, res) => {
  const newData = req.body;
  
 await db.collection('prod').doc(newData.id).delete();
  console.log(newData);
  res.json(newData);
});

app.post('/api/update-event',limiter, async (req, res) => {
  const newData = req.body;
   await db.collection('data').doc(newData.uid).update(newData);
  let eventId = newData.uid;
  
  calendar.events.get({
  auth: auth,
  calendarId: calendarId,
  eventId: eventId,
  }, (err, eventRes) => {
    if (err) {
      console.error('Error fetching event:', err);
      return;
    }

  // Modify the event data
  const event = newData;
   const newEvent = eventRes.data;
    let color;
  if(event.status=="Ordered")
      color="8";
  else
    if(event.status=="Confirmed")
        color="7";
    else
        color="11";
  
  newEvent.summary = event.Name;
  newEvent.description = event.uid+'\n'+event.Name+ '\n' + event.number+ '\n'+ event.address +'\n' +event.datetime + '\n' + event.otherCaption + '\n' + event.status;
  newEvent.start.dateTime = event.startDate;
  newEvent.end.dateTime = event.endDate;
   newEvent.colorId = color;
  calendar.events.update({
    auth: auth,
    calendarId: calendarId,
    eventId: eventId,
    resource: newEvent,
  }, (err, updatedEvent) => {
    if (err) {
      console.error('Error updating event:', err);
      return;
    }
    console.log('Event updated:', updatedEvent.data);
  });
  });
  res.json(newData);
});

// app.post('/api/data', async (req, res) => {
//   const newData = req.body;
//   const docRef = await db.collection('data').doc(newData.uid).set(newData);
//   res.json({message: 'Data saved successfully', id: docRef.id});
// });

app.post('/api/prod-data', async (req, res) => {
  const newData = req.body;
  const cityRef = db.collection('prod').doc(newData.id);
  const doc = await cityRef.get();
  if (!doc.exists) {
      const docRef = await db.collection('prod').doc(newData.id).set(newData);
  } else {
    cityRef.update(newData);
  }
   
  res.json("1");
});

app.get('/api/show-prod-client',limiter, cache(10), async (req, res) => {
  const newData = req.body;
  const citiesRef = db.collection('prod');
    const snapshot = await citiesRef.get();
  let items=[];
    snapshot.forEach((doc) =>  {
    items.push(doc.data());
});
    res.json(items);
});

app.post('/api/show-prod', async (req, res) => {
  const newData = req.body;
  const citiesRef = db.collection('prod');
    const snapshot = await citiesRef.get();
  let items=[];
    snapshot.forEach((doc) => {
    items.push(doc.data());
});
  
   
  res.json(items);
});

///ImageKit
var ImageKit = require("imagekit");
var imagekit = new ImageKit({
    publicKey: process.env.PUBLICKEY,
    privateKey: process.env.PRIVATEKEY,
    urlEndpoint: process.env.URLENDPOINT
});
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log("hi");
  const imageFile = req.file;

  // Upload image to ImageKit.io
  imagekit.upload({
    file: imageFile.buffer.toString('base64'),
    fileName: imageFile.originalname
  })
  .then(response => {
    const imageUrl = response.url;
    res.json({ url: imageUrl });
  })
  .catch(error =>  {
    console.error('Error uploading image to ImageKit:', error);
    res.status(500).json({ error: 'Failed to upload image to ImageKit' });
  });
});


const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});

