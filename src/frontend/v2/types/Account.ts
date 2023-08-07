export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}


export interface Account {
    email: string;
    name: string;
    id: string;
    rssFeeds: string[];
}
