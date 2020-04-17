const pool = require("../../config/database")
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.json())
app.use(cors());

module.exports = { 
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
    getcustomerByContacts:(body, callback) => {
        pool.query( 
            `SELECT * FROM customer where contact =?`,
            [body.customer_contact],
            (error, results, fields) => { 
                if(error){
                    callback(error)
                } 
                return callback(null, results[0]);
            }
        );
    },
    getdriverByid:(body, callback) => {
        pool.query( 
            `SELECT * FROM location where id =?`,
            [body.driver_id],
            (error, results, fields) => { 
                if(error){
                    callback(error)
                } 
                return callback(null, results[0]);
            }
        );
    },
    getbookingDetailByid:(booking_id, callback) => {
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
    alocateDriverToBooking:(data,booking_id, callback)=>{
        console.log(data);
        console.log("boooking...........");
        console.log(booking_id);
        var finish_status=0;
        var booking_status=0;
        pool.query(
            `update booking set
             driver_id=?,
             driver_contact=?,
             driver_name=?,
             booking_status=?,
             finish_status=?
             where id=?`,
             [ 
                data.id,
                data.contact,
                data.name,
                booking_status,
                finish_status,
                booking_id
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
    }
    
}; 
