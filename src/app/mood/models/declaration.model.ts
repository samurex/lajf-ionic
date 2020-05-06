
export interface Declaration {
    id: number;
    mood_id: number;
    scale: number;
    hashtag: string;
    feelings: string;
    image_id: number;
    share: boolean;
    created_at: Date;
    latitude: number;
    longitude: number;
    likes: number;
    liked: boolean;
}
