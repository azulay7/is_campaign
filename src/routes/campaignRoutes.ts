// routes/campaigns.ts
import express from 'express';
import * as campaignController from '../controllers/campaignController';

const router = express.Router();

router.get('/campaigns', campaignController.getCampaigns);
router.get('/campaigns/:id', campaignController.getCampaignById);
router.post('/campaign', campaignController.saveCampaign);

export default router;