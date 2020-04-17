const { 
      create,
      insertDriverIntoLocation,
      getUserByEmail,
      updateDriverFcmTokenIntoLocation,
      updateUser,
      updateUserLocation 
    } = require("./user.service");
    const { sign } =require("jsonwebtoken");
    const { genSaltSync, hashSync, compareSync } = require("bcryptjs")
    const pool = require("../../config/database")

    module.exports = {
    createUser:(req, res) => {
        const body = req.body;
        const salt = genSaltSync(10); 
        body.password = hashSync(body.password, salt);
          create(body, (err, results) => {
              console.log(results.insertId);
            if(err){ 
                console.log(err);
                    return res.status(500).json({
                        success:"0",
                        message:"db connection error"
                    }) 
                    console.log(results);
              }
              const returnid = results.insertId;
                if(returnid){
                    insertDriverIntoLocation(body, returnid, (err, results) => {
                        console.log(body);
                        if(err){
                            console.log(err);
                        }
                        if(results.affectedRows){
                            return res.status(200).json({
                                success:"1",
                                return_id:returnid.toString()
                            })
                        }
                    });
                }else{
                    return res.status(200).json({
                        success:"0",
                        message:"driver not inserted to location table"
                    })
                }
        })
    },
    login:(req, res) => {
        const body = req.body;
        getUserByEmail(body.email, (err, results) => {
            console.log(results)
            if(err){
                console.log(err);
            }
            if(!results){
                return res.status(500).json({
                    success:0,
                    message:"Invalid email or password"
                }) 
            }
            const result = compareSync(body.password, results.password);
            if(result){
                console.log(results.id);
                var returnid = results.id;
                results.password = undefined;
                const jsontoken = sign({result: results}, "qwe1234",{
                    expiresIn: "1h"
                });
                updateDriverFcmTokenIntoLocation(body.fcm_token, returnid, (err, results) => {
                   console.log(results);
                    if(err){
                        console.log(err);
                    }
                    if(!results.affectedRows){
                        return res.json({
                            success:"0",
                            message:"fcm token not updated"
                        })
                    }
                });
                return res.json({
                    success:"1",
                    token:jsontoken,
                    id:results.id.toString(),
                    email: results.email,
                    full_name: results.full_name,
                    contact_number: results.contact_number,
                    profile_image: results.passport_image,
                    emergency_contact: results.emergency_contact,
                    address: results.address,
                    city: results.city,
                    state: results.state,
                    key_auth: results.key_auth,
                    verify_status: results.verifystatus
                });
            } else{
                return res.json({
                    success:"0", 
                    message:"Invalid credentials"
                 });
            }
        })
     }, 
     updateUsers:(req, res) => {
        const body = req.body;
        console.log(req.files);
        // const salt = genSaltSync(10);
        // body.password = hashSync(body.password, salt);
        updateUser(body, req.files, (err, results) => {
            if(err){
                console.log(err);
                return;
            }
            if(!results){
                return res.json({
                    success: "0",
                    message: "failed to update user"
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
  