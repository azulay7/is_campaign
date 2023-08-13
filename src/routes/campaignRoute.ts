import { getCampaigns, validateCampaignData } from "../services/campaignService";
import { Campaign } from "../models/campaign";
import { Request, Response } from "express";
import axios from 'axios';

const express = require('express');
const router = express.Router();
const IS_INTERVIEW_DOMAIN = "http://api.ironsrc.com/interview";

const campaigns: { [id: string]: Campaign } = {};

router.get('/campaigns', async(req: Request, res: Response) => {

    const sortBy: string = <string>req.query.sortBy;
    const sortDirection: string = <string>req.query.sortDirection;

    ////validataion
    if (sortDirection !== 'asc' && sortDirection !== 'desc') {
        throw new Error('Invalid sort direction');
    }

    const validSortColumns = ['id', 'name', 'startDate', 'bid'];
    if (!validSortColumns.includes(sortBy)) {
        throw new Error('Invalid sort column');
    }

    const from:number; 
    const to :number;

    try {
        const campaignsArray: Campaign[] = Object.values(campaigns);
        for(let campaign of campaignsArray){
            campaign = await additionlExternalData(campaign);
        }
        const sortedCampaigns: Campaign[] = getCampaigns(campaignsArray, sortBy, sortDirection);
        
        res.json(sortedCampaigns);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



router.get('/:id', async (req, res) => {
    const campaignId = req.params.id;

    if (campaignId == null || isNaN(campaignId)) {
        console.error(`invalid campaignId: ${campaignId}`);
        res.status(400).json({ error: `Missing id parameter` });
    }
    let campaign = campaigns[campaignId];
    if (campaign == null) {
        res.status(400).json({ error: `campaign with id ${campaignId} not found` });
    }

    try {
        campaign = await additionlExternalData(campaign);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
    // Handle the route logic here
    res.status(200).json(campaign);
});


router.post('/campaign', (req:Request, res:Response) => {
    const campaignData = req.body;

    try {
        validateCampaignData(campaignData);
        campaigns[campaignData.id] = campaignData;
        res.json({ message: 'Campaign saved successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

async function additionlExternalData(campaign: Campaign) {
    try {
        const campaignId:number = campaign.id;
        const deliveryData = await axios.get(`${IS_INTERVIEW_DOMAIN}/delivery/${campaignId}`);
        const statsData = await axios.get(`${IS_INTERVIEW_DOMAIN}/stats/${campaignId}`);
        campaign = { ...campaign, ...deliveryData, ...statsData };
        return campaign;    
    } catch (error) {
        throw new Error('Cant retrieved addtional data campaign with id ${campaignId}');
    }
    
}
