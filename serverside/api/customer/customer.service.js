const pool = require("../../config/database")
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.json())
app.use(cors());

module.exports = { 
    create: (data, callback) => {
        console.log(data.email);
        console.log('insert-data');
        console.log(data);
 
        pool.query(`insert into driver (email, full_name, contact_number, emergency_contact, password, address, city, state)
             values (?,?,?,?,?,?,?,?)`,
             [
                 data.email,
                 data.full_name,
                 data.contact_number,
                 data.emergency_contact,
                 data.password,
                 data.address, 
                 data.city,
                 data.state
              ],
             (error, results, fields) => {
                 if(error){
                     return callback(error); 
                 } 
                 return callback(null, results)
             } 
        );
    },
    customerEntryToBooking: (data, callback) => {
        console.log('insert-datakkkkkkkkkk');
        console.log(data);
              pool.query(`insert into booking (customer_contact, start_address, end_address) 
              values (?,?,?)`,
              [
              data.contact,
              data.pickup,
              data.dropl
            ],
             (error, results, fields) => {
                 if(error){ 
                     return callback(error);
                 } 
                 return callback(null, results)
             } 
        );
    },
    getcustomerByContact:(body, callback) => {
        pool.query( 
            `SELECT * FROM customer where contact =?`,
            [body.contact],
            (error, results, fields) => { 
                if(error){
                    callback(error)
                } 
                return callback(null, results[0]);
            }
        );
    },
    updateCustomerOtp: (data, otp, callback) => {
        console.log(data);
        pool.query(
            `update customer set 
             otp=?
             where contact=?`,
             [ 
                otp,
                data.contact
             ],
            (error, results, fields) => { 
                if(error){
                    return callback(error); 
            } 
                  return callback(null, results)
             } 
        );
    },
    createcustomerByContact: (data, otp, callback) => {
        console.log('insert-contact');
        console.log(data);
        pool.query(`insert into customer (contact, otp)
             values (?,?)`,
              [
                data.contact,
                otp
              ],
             (error, results, fields) => {
                 if(error){
                     return callback(error); 
                 } 
                 return callback(null, results)
             } 
        );
    },
    updateCustomerLocation:(data, callback)=>{
        pool.query(
            `update customer set
             plat=?,
             plong=?,
             dlat=?,
             dlong=?, 
             pickup=?,
             dropl=?
             where contact=?`,
             [ 
                 data.plat,
                 data.plong,
                 data.dlat,
                 data.dlong,
                data.pickup,
                data.dropl,
                data.contact
             ],
            (error, results, fields) => { 
                if(error){
                    return callback(error); 
            } 
                  return callback(null, results)
             } 
        );
    },
    driverList:(data, callback) => {
        pool.query( 
            `SELECT * FROM location where availability = 1`,
            [data.contact],
            (error, results, fields) => { 
                if(error){
                    callback(error)
                } 
                return callback(null, results); 
            }
        );
    },
    getdriversByid:(driverid, callback) => {
        pool.query( 
            `SELECT id, full_name, contact_number FROM driver where id =?`,
            [driverid],
            (error, results, fields) => { 
                if(error){
                    callback(error)
                } 
                return callback(null, results[0]);
            }
        );
    },
    getBookingAllotmentStatus:(booking_id, callback) => {
        pool.query( 
            `SELECT * FROM booking where id =?`,
            [booking_id],
            (error, results, fields) => { 
                if(error){
                    callback(error)
                } 
                return callback(null, results[0]);
            }
        );
    },
    updateCustomerFcm:(data, callback) => {
        pool.query(
            `update customer set
            fcmtoken=?
            where contact=?`,
             [ 
                data.fcmtoken,
                data.contact
             ],
            (error, results, fields) => { 
                if(error){
                    return callback(error); 
            } 
                  return callback(null, results)
             } 
        );
    }
 
}; 
