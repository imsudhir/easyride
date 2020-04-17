const { 
      create,
      getcustomerByContact,
      createcustomerByContact,
      updatecustomer,
      updateCustomerOtp,
      driverList,
      getBookingAllotmentStatus,
      updateCustomerLocation,
      updateCustomerFcm,
      customerEntryToBooking,
      getdriversByid 
    } = require("./customer.service");
    
    const fetch = require('node-fetch');
    const axios = require('axios');
    // import axios from 'axios'; 
    const { sign } =require("jsonwebtoken");
    const { genSaltSync, hashSync, compareSync } = require("bcrypt")
    const pool = require("../../config/database")
    var admin = require("firebase-admin");
    var fs = require('fs');
    var serviceAccount = require("C:/Users/FnB IT Serve Pvt Ltd/Documents/GitHub/easyride/serverside/privatekeyDriver.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://easyride-272111.firebaseio.com"
    });
    
    module.exports = {
    createcustomer:(req, res) => {
        const body = req.body;
        const salt = genSaltSync(10); 
        body.password = hashSync(body.password, salt);
          create(body, (err, results) => {
              console.log(results.insertId);
            if(err){ 
                // console.log(err);  
                    return res.status(500).json({
                        success:"0",
                        message:"db connection error"
                    }) 
              }
            return res.status(200).json({
                success:"1",
                return_id:results.insertId
                // data:results
            })
        })
    }, 
    login:(req, res) => { 
        const body = req.body;
        console.log(req.body); 
        //...
        var generateOtp = Math.floor(1000 + Math.random() * 9000);
        var usermobileinput = body.contact;
        console.log(usermobileinput);
        var otpResponseStatus;
            var user=501234; 
            var authkey="92wITJSMLFOHs";
            var mobile= usermobileinput;
            var sender="EZYRID";
            var rpt=1;
            var text="Welcome to ezyride OTP-"+generateOtp;
            console.log(text);
            var smsurl="http://sms.ziofytech.com/api/pushsms?user="+user+"&authkey="+authkey+"&sender="+sender+"&mobile="+mobile+"&text="+text+"&rpt="+rpt;
            console.log(smsurl);
            //...
function sendOtptoMobile(smsurl) {
                
                axios.get(smsurl)
                .then(function (response) {
                  // handle success
                  console.log(response.data);
                  console.log(response.data.STATUS);
                  otpResponseStatus = response.data.STATUS;
                  console.log(otpResponseStatus);
                return otpResponseStatus
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
                .then(function () {
                  // always executed
                });
            }
        if(body.contact){ 
            console.log(otpResponseStatus);
        getcustomerByContact(body, (err, results) => {
            if(err){
                console.log(err);
            } 
            if(!results){
            console.log("contact not mached");
                createcustomerByContact(body, generateOtp, (err, results) => {
                console.log(results);
                console.log("lllllllll");
                    if(results.affectedRows){
                    sendOtptoMobile(smsurl);
                      console.log(otpResponseStatus);
                       return res.json({ 
                           success:"1",
                           message:"contact saved otp send",
                           otp:generateOtp 
                       })
                   }else{
                       return res.json({
                           success:"0",
                        });
                   }
                }) 
            } else{ 
                console.log("update otp part //////////");
               var otpResponseStatus1=sendOtptoMobile(smsurl);
               console.log(otpResponseStatus1);
               console.log("/////////////////////");
                updateCustomerOtp(body, generateOtp, (err, results) => {
                        console.log(results);
                        console.log("......///////");
                         if(err){
                            console.log(err);
                            return;
                        } 
                        if(results.affectedRows){
                            getcustomerByContact(body, (err, results) => {
                                console.log(">>>>>>>");
                                console.log(results);
                                console.log(">>>>>>>");
                                if(err){
                                    console.log(err);
                                } 
                            if(!results.otp){
                                return res.json({
                                    success:"0",
                                    message:"otp not found"
                                });
                            } else{
                                return res.json({
                                    success:"1",
                                    otp:results.otp,
                                    message:"contact matched otp send"
                                });
                            }                            
                          });
                        } else{
                                return res.json({
                                    success:"0",
                                    message:"otp not updated"
                                });
                              } 
                    });
                 
            }
        })
    }else{
        return res.json({
            success:"0",
            message:"contact required"
        });
    }
     },
     resendOtp:(req, res)=>{
         console.log("hiiiiii................");
        var body = req.body;
        console.log(body);
        var generateOtp = Math.floor(1000 + Math.random() * 9000);
        var usermobileinput = body.contact;
        console.log(usermobileinput);
        var otpResponseStatus;
            var user=501234; 
            var authkey="92wITJSMLFOHs";
            var mobile= usermobileinput;
            var sender="EZYRID";
            var rpt=1;
            var text="Welcome to ezyride OTP-"+generateOtp;
            console.log(text);
            var smsurl="http://sms.ziofytech.com/api/pushsms?user="+user+"&authkey="+authkey+"&sender="+sender+"&mobile="+mobile+"&text="+text+"&rpt="+rpt;
//...
function sendOtptoMobile(smsurl) {
                
                axios.get(smsurl)
                .then(function (response) {
                  // handle success
                  console.log(response.data);
                  console.log(response.data.STATUS);
                  otpResponseStatus = response.data.STATUS;
                  console.log(otpResponseStatus);
                return otpResponseStatus
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                })
                .then(function () {
                  // always executed
                });
            }
        console.log("update otp part //////////");
        var otpResponseStatus1=sendOtptoMobile(smsurl);
        console.log(otpResponseStatus1);
        console.log("/////////////////////");
         updateCustomerOtp(body, generateOtp, (err, results) => {
                 console.log(results);
                 console.log("......///////");
                  if(err){
                     console.log(err);
                     return;
                 } 
                 if(results.affectedRows){
                     getcustomerByContact(body, (err, results) => {
                         console.log(">>>>>>>");
                         console.log(results);
                         console.log(">>>>>>>");
                         if(err){
                             console.log(err);
                         } 
                     if(!results.otp){
                         return res.json({
                             success:"0",
                             message:"otp not found"
                         });
                     } else{
                         return res.json({
                             success:"1",
                             otp:results.otp,
                             message:"contact matched otp send"
                         });
                     }                            
                   });
                 } else{
                         return res.json({
                             success:"0",
                             message:"otp not updated"
                         });
                       } 
             });
     },
     verify:(req, res) => {
         var getBody = req.body;
         console.log(getBody);
        getcustomerByContact(getBody, (err, results) => {
            console.log(results)
            if(err){
                console.log(err);
            }
            if(results.otp===getBody.otp){
                updateCustomerFcm(getBody, (err, results) => {
                    if(err){
                        console.log(err);
                        return;
                    }
                    var customerJsontoken = sign({result: results}, "qwe1234",{
                        expiresIn: "1h"
                    });
                    return res.json({
                        success:"1", 
                        token:customerJsontoken,
                        message:"Otp verified"
                    });
                });        
           
        }else{
            return res.json({
                success:"0",
                message:"Wrong otp"
            });
        }
        })
      },
      searchDriver:(req, res) => {
        const body = req.body;
        if(body.contact && body.pickup && body.dropl){
        customerEntryToBooking(body, (err, results) => {
            console.log(".............................................");
            console.log(results);
            if(err){
                console.log(err);
                return;
            }
            var booking_id=results.insertId; 
        
            if(!results.affectedRows){
                return res.json({
                    success: "0",
                    message: "failed to update customer location"
                });
            } else{
                driverList(body, (err, results) => {
                    function getDistance(clat1, clon1, dlat2, dlon2, unit) {
                        if ((clat1 == dlat2) && (clon1 == dlon2)) {
                            return 0;
                        }
                        else {
                            var radlat1 = Math.PI * clat1/180;
                            var radlat2 = Math.PI * dlat2/180;
                            var theta = clon1-dlon2;
                            var radtheta = Math.PI * theta/180;
                            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                            if (dist > 1) {
                                dist = 1;
                            }
                            dist = Math.acos(dist);
                            dist = dist * 180/Math.PI;
                            dist = dist * 60 * 1.1515;
                            if (unit=="K") { dist = dist * 1.609344 } 
                            if (unit=="N") { dist = dist * 0.8684 }
                            return dist;
                        }
                    }
                    console.log(booking_id);
                    var returned_distance = [];
                    var returned_DriverData = [];
                    results.forEach(driver => {
                        var key = driver.id;
                    var distance= getDistance(driver.latitude, driver.longitude, body.plat, body.plong)/0.6217;
                     var getDriverDataString= distance.toString().concat("|").concat(key).concat("|").concat(driver.fcmtoken).concat("|").concat(driver.contact).concat("|").concat(driver.name);
                    //  var getDistanceString= distance.toString().concat("|").concat(key).concat("|").concat(driver.fcmtoken);
                     var getDistanceString= distance.toString();
                        returned_distance.push(getDistanceString);
                        returned_DriverData.push(getDriverDataString);
                     });
                     const sortReturned_distance = () => {
                        returned_distance.sort((a, b)=>{return a - b});
                    return returned_distance  
                    }
                    const sortReturned_DriverData = () => {
                        returned_DriverData.sort((a, b)=>{return a - b});
                    return returned_DriverData  
                    }
                      var sortedReturned_distance = sortReturned_distance();
                      console.log(sortedReturned_distance,'>>>>>>>>>>>>>>');
                     
    
         const checkDriverAcceptance = () => {
                    var count = 0;
                    console.log(booking_id);

                      for(i=0; i<=sortedReturned_distance.length; i++){

                            for(j=0; j<=returned_DriverData.length; j++){
                                if(sortedReturned_distance[i]==returned_DriverData[j].split("|")[0]){
                                    console.log(returned_DriverData[j].split("|")[1],"is our main driver to send notification");
                                     // exit;
                              var token = returned_DriverData[j].split("|")[2];
                              console.log(booking_id,'...............................');
                                    var payload = { 
                                        notification: {
                                          title:"Customer Details",
                                          body: "Accept Booking"
                                        },
                                        data: {
                                          contact: body.contact,
                                          bookingid:booking_id.toString()
                                    } 
                                      };
                                      var options = {
                                        priority: "high", 
                                        timeToLive: 60 * 60 * 24
                                      };
                                    admin.messaging().sendToDevice(token, payload, options)
                                    .then((response) => {
                                            console.log('Successfully sent message:', response);
                                            var notificationSend = response.successCount;
                                            console.log("jojojojoo");
                                            console.log(response.results[0].error);
                                            console.log(response.failureCount);
                                    }).catch((error) => { 
                                            console.log('Error sending message:', error);
                                    });
                                      
                        var id = setInterval(bookingAllotmentStatus, 1000);
                            function bookingAllotmentStatus() {
                                getBookingAllotmentStatus(booking_id, (err, results) => {
                                    console.log(results);
                                    if(err){
                                        console.log(err);
                                    }
                                    if(results.driver_id){
                                        console.log(results.driver_id);
                                        console.log("driver alloted"); 
                                    clearInterval(id);
                                    console.log("booking allotment status loop interval cleared"); 
                                    return res.json({
                                        success: "1",
                                        contact: results.driver_contact,
                                        name: results.driver_name
                                    });

                                    }else{
                                        console.log('results.driver_id not found');
                                    }
                                }); 
                            console.log("hi"); 
                            }
                                        // }
                                 
                                    break;
                                    // aasasas;
                                }
                            }
                            console.log("outerloop1");
                            break;
                            console.log("outerloop2");
                        }
                       
                      }
                      checkDriverAcceptance();
                }); 
        } 
        });
    }else{
        return res.json({
            success: "0",
            message: "Fill all required field"
        });
    }
     },
     updatecustomers:(req, res) => {
        const body = req.body;
        console.log(req.files);
        // const salt = genSaltSync(10);
        // body.password = hashSync(body.password, salt);
        updatecustomer(body, req.files, (err, results) => {
            if(err){ 
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: "0",
                    message: "failed to update customer"
                });
            } else{
            return res.json({
                success: "1",
                message: "updated successfully"
            });
        }
        });
     }
}
  