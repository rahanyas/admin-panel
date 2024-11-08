import express from 'express';
const router = express.Router();
import {loginPage, homePage, editPage, editUser, deleteUser, addUserPage, addUser} from'../controllers/adminController.js'
import User from '../model/userModel.js';


router.get('/adminLogin', loginPage);
router.post('/admin_login',homePage);
router.get('/edit/:id', editPage);
router.post('/update/:id', editUser);
router.get('/delete/:id', deleteUser);
router.get('/add', addUserPage);
router.post('/add', addUser);

router.post('/getUsers',async (req, res) => {
  let payload = req.body.payload.trim();
  // console.log(payload);
   let search = await User.find({
    fullName : { $regex : new RegExp('^' + payload+ '.*','i')}
   }).exec();
  //  limiting the search results
   search = search.slice(0, 10);
   res.send({payload : search})
})

export default router;