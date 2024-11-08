import admin from "../model/adminModel.js";
import session from "express-session";
import User from "../model/userModel.js";
import bcrypt from 'bcryptjs'


let errorMessage;
let message;

const loginPage = async (req, res) => {
  const Users = await User.findOne({isDeleted : false});
  if (req.session.isAdmin) {
     return res.render('admin_home', {
      Users: Users,
      message : null
    })
  } else {
    res.render('admin_login', {
      errorMessage: null
    })
  }
};



const homePage = async (req, res) => {
  const { password, email } = req.body;

  try {
    const adminUser = await admin.find({ email: email, password: password });
    if (adminUser) {
      req.session.isAdmin = true;
      const Users = await User.find({isDeleted : false});
      return res.render('admin_home', {
        Users: Users,
        message : null,
      })
    } else {
      return res.render('admin_login', {
        errorMessage: 'wrong credentials'
      })
    }

  } catch (err) {
    console.error(err.cause)
  }

}

const editPage = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
     res.render('admincrud/editUser', {userId,
      _id : user._id,
      email : user.email,
      gender : user.gender,
      fullName : user.fullName
     });
}

const editUser = async (req, res) => {
  try{
    const userId = req.params.id;
   
    const updateData = {
      email : req.body.email,
      fullName : req.body.fullName,
      gender : req.body.gender
    }
    const Users = await User.findOne({isDeleted : false});
    const editedUser = await User.findByIdAndUpdate(userId, updateData, {new : true})
     if(editedUser){
       return res.render('admin_home', {
        message : 'user upadated successfully',
        Users : Users
      });
     }else{
      return res.render('admin_home', {
        message : 'update failed'
      })
     }
  }catch (err){
     console.error(err);
     return res.render('admin_home', {
      message : 'error occured while updating'
     })
  }
 
} 

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userDelete = await User.findByIdAndUpdate(userId, { isDeleted: true });
    if (userDelete) {
      const Users = await User.find({ isDeleted: false }); 
      return res.render('admin_home', {
        Users: Users,
        message: 'User deleted successfully'
      });
    } else {
      return res.render('admin_home', {
        message: 'User deletion failed'
      });
    }
  }catch(err) {
    console.error(err);
  }
}

const addUserPage = (req, res) => {
  res.render('adminCrud/addUser.ejs');
};

const addUser = async (req, res) => {
  try{
    const {fullName , email, password, gender} = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User ({
      email,
      password : hashedPass,
      gender,
      fullName,
    });
    await newUser.save();
    const Users = await User.findOne({isDeleted : false})
    return res.render('admin_home', {
      message : 'user added successfully',
      Users
    });
  }catch(err) {
    console.error(err)
  }
}


export { loginPage, homePage, editPage, editUser, deleteUser, addUserPage, addUser};