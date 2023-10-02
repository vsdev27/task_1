import { app } from '../..';
const { body, validationResult} = require("express-validator");
const axios= require('axios')
import * as usersApiController from '../../controller/user/user'
import * as commonapicontroller from '../../controller/user/common'

export const BindUrl = () => {
    
    //register_api
    app.post('/api/users/signup',
    body("email")
      .not().isEmpty().withMessage('Email id is required')
      .isEmail().withMessage('Invalid email id ')
      .trim(),
    body("user_name").not().isEmpty().trim(),
    body("password").not().isEmpty().trim(),
    
     async (req :any, res:any ) => {
      try {
        //validate req
        const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(406).json({ errors: errors.array() });
      }
        const data = await req.body;
        usersApiController.REGISTER1(data, (respData:any) => {
          res.status(respData.ReturnCode).send(respData);
        });
      } catch (err) {
        res.status(500).send("Internal server error");
      }
    });


    //login_api
    app.post('/api/users/login',
    body("email")
    .not().isEmpty().withMessage('Email id is required')
    .isEmail().withMessage('Invalid email id ')
    .trim(),
    body("password").not().isEmpty().trim(),
     async (req :any, res:any ) => {
      try {
        const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(406).json({ errors: errors.array() });
      }
        const data = await req.body;
        usersApiController.LOGIN(data, (respData:any) => {
          res.status(respData.ReturnCode).send(respData);
        });
      } catch (err) {
        res.status(500).send("Internal server error");
      }
    });


    app.post('/api/users/me',

     async (req :any, res:any ) => {
      try {
        const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(406).json({ errors: errors.array() });
      }
      
        commonapicontroller.VALIDATE_USER(req,  async function (respData:any) {
          if (respData.ReturnCode !== 200) {
            res.status(respData.ReturnCode).send(respData);
          } else {            
            const data = await req.body;
            data.userData = respData.data;

            usersApiController.GET_PROFILE(data, (respData:any) => {
              res.status(respData.ReturnCode).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(500).send("Internal server error");
      }
    });


    app.post('/api/users/logout',

     async (req :any, res:any ) => {
      try {
        const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(406).json({ errors: errors.array() });
      }
      
        commonapicontroller.VALIDATE_USER(req,  async function (respData:any) {
          if (respData.ReturnCode !== 200) {
            res.status(respData.ReturnCode).send(respData);
          } else {            
            const data = await req.body;
            data.userData = respData.data;
            var token = req.headers['authorization'];
            data.token = token
            usersApiController.LOGOUT(data, (respData:any) => {
              res.status(respData.ReturnCode).send(respData);
            });
          }
        });
      } catch (err) {
        res.status(500).send("Internal server error");
      }
    });

    app.get('/api/random-joke',
     async (req :any, res:any ) => {
      try {
        const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(406).json({ errors: errors.array() });
      }

      commonapicontroller.VALIDATE_USER(req,  async function (respData:any) {
        if (respData.ReturnCode !== 200) {
          res.status(respData.ReturnCode).send(respData);
        } else {            
            const response = await axios.get('https://api.chucknorris.io/jokes/random');
            const data = response.data.value;
            res.json({ data });
        }
      });
      } catch (err) {
        res.status(500).send("Internal server error");
      }
    });

  };
