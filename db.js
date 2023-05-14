import {db, Table} from './db.config.js'
import aws from "aws-sdk"
const ses= new aws.SES({region: "eu-north-1"});

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
function sesTest(emailTo,emailFrom,message,name){
    const params = {
        Destination : {
            ToAddresses: [emailTo]
        },
        Message : {
            Body : {
                Text : {
                    Data : "From Contact : " + name + "\n" + message
                }
            },
            Subject : {
                Data  : "Name: "+emailFrom
            }
        },
        Source : "mailtest.6065@gmail.com"
    };
    return ses.sendEmail(params).promise();
}

// Create or Update users
const createOrUpdate = async (data = {}) =>{
    const params = {
        TableName: Table,
        Item: data
    }

    try{
        await db.put(params).promise()
        return { success: true }
    } catch(error){
        return { success: false}
    }
}

// Read all users
const readAllUsers = async()=>{
    const params = {
        TableName: Table
    }

    try{
        const { Items = [] } = await db.scan(params).promise()
        return { success: true, data: Items }

    } catch(error){
        return { success: false, data: null }
    }

}

// Read Users by ID
const getUserById = async (value, key = 'id') => {
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    }
    try {
        const { Item = {} } =  await db.get(params).promise()
        return { success: true, data: Item }
    } catch (error) {
        return {  success: false, data: null}        
    }
}

// Delete User by ID
const deleteUserById = async(value, key = 'id' ) => { 
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    }
        
    try {
        await db.delete(params).promise()
        return {  success: true }

    } catch (error) {
        return{ success: false }
    }
}

//upload image in aws S3


export {
    createOrUpdate,
    readAllUsers,
    getUserById,
    deleteUserById,
    sesTest,
}