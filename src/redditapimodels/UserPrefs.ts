export type UserPrefKeys = keyof UserPrefs;
export interface UserPrefs
{
    default_theme_sr: null;
    threaded_messages: boolean
    hide_downs: boolean;
    activity_relevant_ads: boolean;
    show_stylesheets: boolean;
    show_link_flair: boolean;
    creddit_autorenew: boolean;
    show_trending: boolean;
    no_profanity: boolean;
    private_feeds: boolean;
    monitor_mentions: boolean;
    show_snoovatar: boolean;
    research: boolean;
    ignore_suggested_sort: boolean;
    email_digests: boolean;
    num_comments: number;
    clickgadget: boolean;
    "3rd_party_site_data_personalized_content": boolean;
    use_global_defaults: boolean;
    label_nsfw: boolean;
    domain_details: boolean;
    email_messages: boolean;
    live_orangereds: boolean;
    highlight_controversial: boolean;
    "3rd_party_data_personalized_ads": boolean;
    over_18: boolean;
    collapse_left_bar: boolean;
    lang: string;
    hide_ups: boolean;
    public_server_seconds: boolean;
    allow_clicktracking: boolean;
    hide_from_robots: boolean;
    compress: boolean;
    store_visits: boolean;
    threaded_modmail: boolean;
    min_link_score: number;
    media_preview: string;
    enable_default_themes: boolean;
    geopopular: null;
    content_langs: string[];
    show_promote: null;
    hide_locationbar: boolean;
    min_comment_score: number;
    public_votes: boolean;
    no_video_autoplay: boolean;
    organic: boolean;
    collapse_read_messages: boolean;
    show_flair: boolean;
    mark_messages_read: boolean;
    search_include_over_18: boolean;
    force_https: boolean;
    hide_ads: boolean;
    beta: boolean;
    top_karma_subreddits: boolean;
    newwindow: boolean;
    numsites: 25;
    legacy_search: boolean;
    media: string;
    show_gold_expiration: boolean;
    highlight_new_comments: boolean;
    default_comment_sort: string;
    "3rd_party_site_data_personalized_ads": boolean;
    accept_pms: string
}