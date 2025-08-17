var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const {updateSubscription} = require('./authorize');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const utils = require('./utils.js');
app.get('/', (req,res)=>{
  utils.sendEmailNotification('Subscription Update', 'The subscription has been updated successfully.', function(err){
		if(err){
			console.log('Error sending email notification: ' + err);
		}
	});

  if(req.body)
  {
    var inputobj= {
      subcriptionId:req.body.subcriptionId,
      expiry:req.body.expiry,
      creditCard: req.body.number,
     
    }
    // Add email sending service 
    console.log(inputobj);
    updateSubscription(inputobj, function(data){
      var resCode=data.getMessages().getMessage()[0].getCode();
      var resMes=data.getMessages().getMessage()[0].getText();
      
      if(resCode==='Ok')
     {
        console.log('Subscription updated successfully');
       res.send('Yes')
     }
     else
     {
       res.send(resMes)
     }
      }
      )
    
  }

});
// app.options('/', (req,res)=>{

//   if(req.body)
//   {
//     var inputobj= {
//       subcriptionId:req.body.subcriptionId,
//       expiry:req.body.expiry,
//       creditCard: req.body.number,
 
//     }
    
//     updateSubscription(inputobj, function(data){
//       var resCode=data.getMessages().getMessage()[0].getCode();
//       var resMes=data.getMessages().getMessage()[0].getText();
      
//       if(resCode==='Ok')
//      {
//        res.send('Yes')
//      }
//      else
//      {
//        res.send(resMes)
//      }
//       }
//       )
    
//   }

// })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
