import { Campaign } from "../models/campaign";
import axios from 'axios';
const IS_INTERVIEW_DOMAIN = "http://api.ironsrc.com/interview";

export function sortCampaigns(campaigns: any[], sortBy?: string, sortDirection?: string) {
  if (sortBy == null) {
    return campaigns;
  }
  sortDirection = 'asc';

  const sortedCampaigns = campaigns.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  return sortedCampaigns;
}

/**
 * dsadsakmk
 * @param campaignData 
 */
export function validateCampaignData(campaignData: any) {
  if (typeof campaignData.name !== 'string' || campaignData.name.length > 200) {
    throw new Error('Campaign name should be a string no longer than 200 characters.');
  }

  if (campaignData.startDate && !isValidDate(campaignData.startDate)) {
    throw new Error('Start date should be a valid date or left empty.');
  }

  const bid = parseFloat(campaignData.bid);
  if (isNaN(bid) || bid < 0.001 || bid > 150) {
    throw new Error('Bid should be a floating point number between 0.001 and 150.');
  }
}

function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date?.getTime());
}

export async function additionlExternalData(campaign: Campaign) {
  try {
    const campaignId: number = campaign.id;
    const [deliveryData,statsData]= await Promise.all([axios.get(`${IS_INTERVIEW_DOMAIN}/delivery/${campaignId}`),axios.get(`${IS_INTERVIEW_DOMAIN}/stats/${campaignId}`)]);
    campaign = { ...campaign, ...deliveryData.data, ...statsData.data };
    return campaign;
  } catch (error) {
    throw new Error('Cant retrieved addtional data campaign with id ${campaignId}');
  }

}