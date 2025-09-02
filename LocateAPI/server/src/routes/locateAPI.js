import express from 'express';
import consultaDireccion from '../controllers/address.js';
import consultaDireccionQuery from '../controllers/addressByName.js';


const router = express.Router();


router.get('/', consultaDireccionQuery);

router.get('/query', consultaDireccion); 

export default router;// locateAPI.js