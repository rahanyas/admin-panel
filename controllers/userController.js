import User from '../model/userModel.js'
import session from 'express-session';
import bcrypt from 'bcryptjs';

let errorMessage;

const loginPage = (req, res) => {
  
  if (req.session.loggedIN) {
    res.render('home', {
      title: 'home Page',
      style: 'home'
    })
  } else {
    res.render('login', {
      title: 'login Page',
      style: 'login',
      errorMessage : null
    });
  }
};

const signupPage = (req, res) => {
  res.render('signup', { 
    title: 'signup page', 
    style: 'signup',
    errorMessage : null
    });
}

const handleSignup = async (req, res) => {

  const { email, password, gender , confirmPass, fullName} = req.body;

  if(password !== confirmPass){
    return res.render('signup', {
      title : 'signup page',
      style : 'signup',
      errorMessage : 'password do not match'
    })
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
         return res.render('signup', {
          title : 'signup page',
          style : 'signup',
          errorMessage : 'user already exists'
         })
    } else {
      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPass,
        gender,
        fullName,
      });

      await newUser.save();
      return res.render('login', { 
        title: 'login', 
        style: 'login', 
        errorMessage: null
      });
    }
    

  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
}

const handelLogin = async (req, res) => {
  const { email, password} = req.body;

  try {
    const user = await User.findOne({email, isDeleted : false});
    if (!user) {
       return res.render('login', {
        title : 'login page',
        style : 'login',
        errorMessage : 'wrong credentials'
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.loggedIN = true;
      return res.render('home', {
        title: 'Home Page',
        style: 'home'
      });
    } else {
      
        return res.render('login', {
        title : 'login page',
        style : 'login',
        errorMessage : 'wrong credentials'
      })
    }
  } catch (err) {
    console.error(err.cause);
  }
};

const homePage = (req, res) => {
  res.render('home', {
    title: 'home Page',
    style: 'home'
  })
};

const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/')
    }
  })
}

export { loginPage, signupPage, handleSignup, homePage, handelLogin, handleLogout };