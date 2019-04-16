import express from 'express';
import Profiles from '../../controllers/profiles';

const router = express.Router();

router.put('/user/:username', Profiles.updateProfile);

export default router;
