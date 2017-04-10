var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	  = require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var Categories  = require('./app/models/categories'); // get the mongoose model
var Event       = require('./app/models/event'); // get the mongoose model
var Groups      = require('./app/models/groups'); // get the mongoose model
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
 
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/images", express.static(__dirname + '/images'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

 
// log to console
app.use(morgan('dev'));
 
// Use the passport package in our application
app.use(passport.initialize());
 
// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//Connect to the mongoDB 
mongoose.connect(config.database);
 
// pass passport for configuration
require('./config/passport')(passport);
 
// bundle our routes
var apiRoutes = express.Router();
 
// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.json({success: false, msg: 'Please pass name, email and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      birthdate: req.body.birthdate
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

//Authentification
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({ email: req.body.email })
    .populate({
      path:     'groups',       
      populate: { path:  'users',
            model: 'User' }
    })
    .populate('friends')
    .populate('pending_friends')
    .exec(
      function(err, user) {
      if (err) throw err;

      if (!user) {
        res.send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.encode(user, config.secret);
            // return the information including token as JSON
            res.json({success: true, user: user, token: 'JWT ' + token});
          } else {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
  });
});

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

apiRoutes.get('/categories', function(req, res){

  Categories.find({}, function(err, categories){
    if(categories)
      res.json({success: true, categories: categories});
    else
      res.json({success: false, categories: null});
  });
});

apiRoutes.get('/userInfo', function(req, res){

  User.findOne({  _id: mongoose.Types.ObjectId(req.query._User) })
  .populate({
    path:     'groups',       
    populate: { path:  'users',
          model: 'User' }
  })
  .populate('friends')
  .populate('pending_friends')
  .exec(function(err, user){
    if(err)
      res.json({success: false, msg: "Coudln't do that!"});
    else
      res.json({success: true, user: user});
  });
});

//event creation
apiRoutes.post('/createEvent', function(req, res) {
  User.findOne({
    _id: mongoose.Types.ObjectId(req.body._creator)
  }, function(err, user) {
    if (err) throw err;
      var newEvent = new Event({
        creator: user,
        name: req.body.name,
        languages: req.body.languages,
        category: req.body.category,
        subCategory : req.body.subCategory,
        priceNumber : req.body.priceNumber,
        priceCurrency : req.body.priceCurrency,
        date : req.body.date,
        time : req.body.time,
        address : req.body.address,
        lat : req.body.lat,
        lng : req.body.lng,
        city : req.body.city,
        spotsMax : req.body.spotsMax,
        spotsLeft: req.body.spotsLeft
      });

      newEvent.save((err)=>{
        if(err) throw err;
        else
          res.json({success: true});
      });
  });
});

apiRoutes.get('/events', function(req, res){
  Event.find({date: { $gte: new Date() }})
    .populate('creator')
    .sort('date')
    .exec(function(err, events){
      if(events){
        res.json({success: true, events: events});
      }
      else
        res.json({success: false, events: null});
    });
});

apiRoutes.post('/createGroup', function(req, res){
  User.findOne({
    _id: mongoose.Types.ObjectId(req.body._User)
  }, function(err, user) {
    if (err) throw err;
      var newGroup = new Groups({
        name: req.body.name,
        color: req.body.color,
        creator: req.body._User
      });
      newGroup.save((err) => {
        if(err) throw err;
        else
        {
          user.groups.push(newGroup);
          user.save((err) => {
            if(err) throw err;
            else res.json({success: true, group: newGroup});
          })
        }
      })
    });
});

apiRoutes.post('/deleteGroup', function(req, res){
  Groups.findOneAndRemove({
    _id: mongoose.Types.ObjectId(req.body._groupId)
  }, function(err, group){
      if(err) throw err;
      else{
        User.findOne({
          _id: mongoose.Types.ObjectId(group.creator)
        }, function(err, user){
          if(err) throw err;
          else {
            console.log("before "+user.groups);
            user.groups = user.groups.filter((groupElem) => {
              return (!(groupElem.toString() == group._id.toString()));
            });
            user.save((err) => {
              if(err) throw err;
              else res.json({success: true});
            });
          }  
        });
      }
  });
});

apiRoutes.get('/mapEvents', function(req, res){
  let limits = req.query;
  Event.find({ 
      $and:[
        {date: { $gte: new Date() } },
        {lat: { $gte: limits.latSW } },
        {lng: { $gte: limits.lngSW } },
        {lat: { $lte: limits.latNE } },
        {lng: { $lte: limits.lngNE } }
      ]
    })
    .populate('creator')
    .sort('date')
    .exec(function(err, events){
      if(events)
        res.json({success: true, events: events});
      else
        res.json({success: false, events: null});
    });
});

apiRoutes.post('/addUserToGroup', function(req, res){
  Groups.findOne({
    _id: mongoose.Types.ObjectId(req.body._groupId)
  }, function(err, group){
     User.findOne({ email: req.body.email.toLowerCase()}, function(err, user){
      if(err) throw err;
      else{
        //Check if we found a user
        if(user){
            //Check if the user is already in the group 
            var sameUser = group.users.filter((userInGroup) => {
              return (userInGroup.toString()==user._id.toString());
            });

            if(group.users.length > 0 && sameUser.length > 0)
                res.json({success: false, msg: user.name+" is already in this group"});
            else{
              group.users.push(user);
              group.save((err) => {
                if(err) throw err;
                else res.json({success: true, user: user});
              });
            }
        }
        else{
          res.json({success: false, msg: "Could not find this user"});
        }
      }
     })
  });
});

apiRoutes.post('/delUserFromGroup', function(req, res){

  Groups.findOne({
    _id: mongoose.Types.ObjectId(req.body._groupId),
    creator: mongoose.Types.ObjectId(req.body._creatorId),
    users: mongoose.Types.ObjectId(req.body._userId)
  }, function(err, group){
      if(err) throw err;
      else{
        group.users = group.users.filter((userID) => {
          return userID.toString() != req.body._userId; 
        });
        group.save((err) => {
          if(err) throw err;
          else res.json({success: true});
        });
      }
  });
});

apiRoutes.post('/deleteFriendFromList', function(req, res){

  User.findOne({
    _id: mongoose.Types.ObjectId(req.body._User)
  }, function(err, user) {
    if(err) 
      res.json({success: false, msg: "Couln't delete this friend!"});
    else {
      User.findOne({
          _id: mongoose.Types.ObjectId(req.body.friend_id)
        }, function(err, friend){
          if(!friend){
            user.friends = user.friends.filter((friend) => {
              return friend._id.toString() != req.body.friend_id; 
            });
            user.save((err)=> {
            if(err)
              res.json({success: false, msg: "Couln't delete this friend"});
            else
              res.json({ success: true });
            });
          }
          else{
          var index = user.friends.indexOf(friend);
          user.friends.splice(index, 1);
          var indexF = friend.friends.indexOf(user);
          friend.friends.splice(indexF, 1);

          user.save((err)=> {
            if(err)
              res.json({success: false, msg: "Couln't delete this friend"});
            else{
              friend.save((err) => {
                if(err)
                  res.json({success: false, msg: "Couln't delete this friend"});
                else
                  res.json({ success: true });
              });
            }
          });
        }
      });
    }
  });
});

apiRoutes.get('/myEvents', function(req, res){
  Event.find({ 
      $and:[
        { date: { $gte: new Date() }},
        { creator: req.query.id }
      ]
    })
    .populate('users', 'name')
    .populate('creator', 'name')
    .sort('date')
    .exec(function(err, events){
      if(events){
        res.json({success: true, events: events});
      }
      else
        res.json({success: false, events: null});
    });
});

apiRoutes.get('/registeredEvents', function(req, res){
  Event.find({ 
        date: { $gte: new Date() },
        users: mongoose.Types.ObjectId(req.query.id) 
    })
    .populate('users', 'name')
    .populate('creator', 'name')
    .sort('date')
    .exec(function(err, events){
      if(events){
        res.json({success: true, events: events});
      }
      else
        res.json({success: false, events: null});
    });
});

apiRoutes.post('/sendInvitePending', function(req, res){
  User.findOne({ email: req.body.email.toLowerCase()})
    .exec(function(err, friend){
    if(err) throw err;
    if(!friend)
      res.json({success: false, msg: "Couldn't find this friend"});
    else{
      if(req.body._User == friend._id){
        res.json({success: false, msg: "Come on ... You can't be your own friend!"});
      }
      else {
      User.findOne({ _id: mongoose.Types.ObjectId(req.body._User) }, function(err, currentUser){
        friend.pending_friends.push(currentUser);
        friend.save((err) => {
          if(err) throw err;
          else
            res.json({success: true, msg: "The invit is pending!"});
        });
      })
      }
    }
  });
});

apiRoutes.post('/acceptFriendById', function(req, res){
  User.findOne({ _id: mongoose.Types.ObjectId(req.body._User) }, function(err, currentUser){
    if(err) throw err;
    else{
      User.findOne({ _id: mongoose.Types.ObjectId(req.body.friend_id) }, function(err, friend){
        if(err) throw err;
        else{
          var index = currentUser.pending_friends.indexOf(friend);
          currentUser.pending_friends.splice(index, 1);
          currentUser.friends.push(friend);
          currentUser.save((err)=> {
            if(err)
              res.json({success: false, msg: "Couldn't accept this friend"});
            else{
              friend.friends.push(currentUser);
              friend.save((err) => {
                if(err)
                  res.json({success: false, msg: "Couldn't accept this friend"});
                else
                  res.json({ success: true });
              });
            }
          });
        }
      });
    }
  })
});

apiRoutes.post('/declineFriendById', function(req, res){
  User.findOne({ _id: mongoose.Types.ObjectId(req.body._User) }, function(err, currentUser){
    if(err) 
      res.json({success: false, msg: "Couldn't decline this invitation"});
    else {
      console.log(currentUser.pending_friends);
      var index = currentUser.pending_friends.indexOf(req.body.friend_id);
      currentUser.pending_friends.splice(index, 1);
      console.log(currentUser.pending_friends);
      res.json({success: false});
    }
  })
});


apiRoutes.post('/addUserToFriendsList', function(req, res){
  User.findOne({ email: req.body.email.toLowerCase()}, function(err, friend){
    if(err) throw err;
    if(!friend)
      res.json({success: false, msg: "Couldn't find this friend"});
    else{
      User.findOne({ _id: mongoose.Types.ObjectId(req.body._User) }, function(err, currentUser){
        currentUser.friends.push(friend);
        currentUser.save((err) => {
          if(err) throw err;
          else
            res.json({success: true, friend: friend});
        });
      })
    }
  });
});
 
// connect the api routes under /api/*
app.use('/api/v1', apiRoutes);
 
// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);


getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};