import { sortCampaigns, validateCampaignData, additionlExternalData } from "../services/campaignService";
import { Campaign, CampaignStatus } from "../models/campaign";
import { Request, Response } from "express";

import express from 'express';

const router = express.Router();

const campaigns: { [id: number]: Campaign } = {
};


export const getCampaigns = async (req: Request, res: Response) => {

    const sortBy: string = <string>req.query.sortBy;
    const sortDirection: string = <string>req.query.sortDirection;
    
    try {
        if (sortBy != null) {
            if (sortDirection !== 'asc' && sortDirection !== 'desc') {
                throw new Error('Invalid sort direction');
            }
    
            const validSortColumns = ['id', 'name', 'startDate', 'bid'];
            if (!validSortColumns.includes(sortBy)) {
                throw new Error('Invalid sort column');
            }
        }
        const campaignsArray: Campaign[] = Object.values(campaigns);
        for (let campaign of campaignsArray) {
            campaign = await additionlExternalData(campaign);
        }
        const sortedCampaigns: Campaign[] = sortCampaigns(campaignsArray, sortBy, sortDirection);
        res.status(200).json(sortedCampaigns);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            console.error('Unexpected error', error);
        }
    }
}



export const getCampaignById = async (req: Request, res: Response) => {
    const campaignId: number | undefined = +req.params.id;

    if (campaignId == null || isNaN(campaignId)) {
        console.error(`invalid campaignId: ${campaignId}`);
        res.status(400).json({ error: `Missing id parameter` });
    }
    let campaign = campaigns[campaignId!];
    if (campaign == null) {
        res.status(400).json({ error: `campaign with id ${campaignId} not found` });
    }

    try {
        campaign = await additionlExternalData(campaign);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            console.error('Unexpected error', error);
        }
    }
    res.status(200).json(campaign);
};


export const saveCampaign = (req: Request, res: Response) => {
    const campaignData = req.body;
    try {
        validateCampaignData(campaignData);
        campaigns[campaignData.id] = campaignData;
        res.json({ message: 'Campaign saved successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            console.error('Unexpected error', error);
        }
    }
};

export default router;