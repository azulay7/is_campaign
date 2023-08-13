export interface Campaign {
    id: number,
    name: string,
    startDate: Date,
    bid: Number,// (float)
    status: CampaignStatus,// (string) - Live, Stopped, Pending
    views: number,
    clicks: number,
    installs: number
}

export enum CampaignStatus {
    Live = "Live",
    Stopped = "Stopped",
    Pending = "Pending"
}