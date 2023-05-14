import express from 'express'
import { createOrUpdate, deleteUserById, getUserById, readAllUsers,sesTest } from './db.js'
import multer from "multer"
const router = express.Router()
const upload = multer({dest:'uploads/'})
import { uploadFile ,getFileStream} from './s3.js'

// READ ALL Users
router.get('/users', async(req, res) => {
    const { success, data } = await readAllUsers()
    console.log("data: ",data)
    if(success){
        return res.json({success, data})
    }
    return res.status(500).json({success:false, messsage: "Error"})
})

// Get User by ID
router.get('/user/:id', async(req, res) => {
    const { id } = req.params
    const { success, data } = await getUserById(id)
    console.log(data)
    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: "Error"})
})


// Create User
router.post('/user', async(req, res) => {
    const { success, data } = await createOrUpdate(req.body)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: 'Error'})
})


// Update User by ID
router.put('/user/:id', async(req, res) => {
    const user = req.body
    const { id } = req.params
    user.id = parseInt(id)

    const { success, data } = await createOrUpdate(user)

    if(success){
        return res.json({success, data})
    }

    return res.status(500).json({success: false, message: "Error"})
})


// Delete User by Id
router.delete('/user/:id', async (req, res) => {
    const { id } = req.params
    const { success, data } = await deleteUserById(id)
    if (success) {
      return res.json({ success, data })
    }
    return res.status(500).json({ success: false, message: 'Error'})
})
  

//Send email service 
router.post('/email',(req,res)=>{
    const {email,message,name}=req.body;
    sesTest("mailtest.6065@gmail.com","mailtest.6065@gmail.com",message,name).then((val)=>{
        res.send("Successfuly");
    }).catch((err)=>{
        console.log(err);
        res.send("error");
    })
})

//Upload image S3 services
router.post('/images',upload.single('image'), async(req,res)=>{
    const file = req.file
    const description = req.body.description

    const result = await uploadFile(file,description)
    console.log("result: ",result);
    res.send("İmages OK");
})

router.get('/image/:key', async (req, res) => {
    console.log("istek geldi");
    const key = req.params.key;
    try {
        const readStream = await getFileStream(key);

    readStream.pipe(res);
    } catch (error) {
       console.error(error) 
    }
});




export default router