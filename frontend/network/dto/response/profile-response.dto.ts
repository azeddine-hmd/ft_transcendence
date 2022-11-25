export interface ProfileResponse {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    tfa?: boolean | undefined;
}
