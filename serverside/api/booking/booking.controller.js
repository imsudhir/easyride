const { 
    customerEntryToBooking,
    getcustomerByContacts,
    getdriverByid,
    alocateDriverToBooking
    } = require("./booking.service");
    const pool = require("../../config/database")
    module.exports = {
    createBooking:(req, res) => {
        const body = req.body;
        console.log(body);
        getcustomerByContacts(body, (err, results) => {
            console.log(results);
            var customer_details={
                contact : results.contact,
                pickup : results.pickup,
                drop : results.dropl
            }
            console.log("jikjkjkk...............");
            console.log(customer_details.dropl);
            if(err){
                console.log(err);
            }
            if(results.contact){
            customerEntryToBooking(results, (err, results) => {
              console.log(results);
              var booking_id=results.insertId;
              console.log("kiiiiiiiiiiiiiiii.."); 
            if(err){ 
                console.log(err);  
                    return res.status(500).json({
                        success:"0",
                        message:"db connection error"
                    }) 
              }
              if(results.affectedRows){
                getdriverByid(body, (err, results) => {
                    console.log(results);
                    console.log(body.driver_id);
                    console.log("driver details........");
                    if(err){
                        console.log(err); 
                    }
                    if(results.id==body.driver_id){
                        alocateDriverToBooking(results, booking_id, (err, results) => {
                            console.log(results);
                            console.log(body.driver_id);
                            if(err){
                                console.log(err); 
                            }
                            if(results.affectedRows){
                                return res.status(200).json({ 
                                    success:"1",
                                    contact : customer_details.contact,
                                    pickup : customer_details.pickup,
                                    drop : customer_details.drop
                                })
                            }else{
                                return res.status(200).json({ 
                                    success:"0",
                                    message:"booking failed"
                                })
                            }
                        });
                      
                    }

              });
            }
                
           
        })
     }
     
    });
    },
     updatecustomers:(req, res) => {
        const body = req.body;
        console.log(req.files);
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
  