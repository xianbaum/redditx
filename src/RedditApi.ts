import { Http, RequestHeader, ResponseHeader } from "./helpers/Http";
import { StorageManager } from "./StorageManager";
import { AuthorizeResult } from "./redditapimodels/AuthorizeResult";
import { RedditError } from "./redditapimodels/Error";
import { User } from "./redditapimodels/User";
import { UserPrefs, UserPrefKeys } from "./redditapimodels/UserPrefs";
import { Listing } from "./redditapimodels/Listing";
import { Thing } from "./redditapimodels/Thing";
import { SubredditKarma } from "./redditapimodels/SubredditKarma";
import { CommentCompose } from "./redditapimodels/CommentCompose";
import { ApiType } from "./redditapimodels/ApiType";
import {ThingsArray} from "./redditapimodels/ThingsArray";
import { JsonData } from "./redditapimodels/JsonData";
import { JsonResponse } from "./redditapimodels/JsonResponse";
import { CommentModel } from "./redditapimodels/Comment";
import { RawJson } from "./redditapimodels/RawJson";
import { RedditMaster } from "./RedditMaster";

export namespace AccountApi {
    export const meBase = "/api/v1/me";    
    export function getIdentity(): Promise<User> {
        return Helpers.genericOauthGet(Helpers.oauthBase+AccountApi.meBase);
    }
    export function getKarma(): Promise<Thing<"karma",SubredditKarma[]>> {
        return Helpers.genericOauthGet(Helpers.oauthBase+AccountApi.meBase+"/karma");
    }
    export function getPrefs(): Promise<UserPrefs> {
        return Helpers.genericOauthGet(Helpers.oauthBase+AccountApi.meBase+"/prefs");
    }
    export function setPrefs(pref: UserPrefs | UserPrefKeys, value?: string) {
        let object: any;
        if(typeof pref === "string" && value !== undefined){
            object = {
                pref: value
            };
        } else {
            object = <UserPrefKeys>pref;
        }
        return Http.request("PATCH", Helpers.oauthBase+AccountApi.meBase+"/prefs", [Helpers.authorizationHeader(), Helpers.userAgent()]);
    }
    export function getFriends(list?: Listing): Promise<Thing<"friends",any>[]> {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/friends", list);
    }
    export function getBlocked(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/blocked", list);
    }
    export function getMessaging(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/messaging", list);
    }
    export function getTrusted(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+"/prefs/trusted", list);
    }
    export function getFriendsV1(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+AccountApi.meBase+"/friends", list);
    }
    export function getBlockedV1(list?: Listing) {
        return Helpers.genericListing(Helpers.oauthBase+AccountApi.meBase+"/blocked", list);
    }
}
export class RedditValiationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Reddit API error";
    }
}
export namespace LinkCommentApi {
    export function postComment(parentId: string, text: string) {
        let comment: CommentCompose | ApiType | RawJson =  {
            parent:  parentId,
            text: text,
            api_type: "json",
            raw_json: 1
        };
        return Http.post(Helpers.oauthBase+"/api/comment",
            comment,
            [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
            true).then((response: JsonResponse<JsonData<ThingsArray<"t1", CommentModel>>>) => {
                Helpers.exceptOnError(response);
                return response;
            });
    }
    export function vote(fullname: string, dir: -1 | 0 | 1)  {
        let data = {
            dir: dir,
            id: fullname,
            rank: 2
        }
        return Http.post(Helpers.oauthBase+"/api/vote", data,
        [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
        true).then((response: {} ) => {
            Helpers.exceptOnError(response);
        });
    }
    export function deleteThing(fullname: string) {
        let data = {
            id: fullname
        };
        return Http.post(Helpers.oauthBase+"/api/del", data,
        [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
        true).then((response: {} ) => {
            Helpers.exceptOnError(response);  
        });
    }
    export function editPost(fullname: string, text: string) {
        let data = {
            api_type: "json",
            return_rtjson: false,
            text: text,
            thing_id: fullname,
            raw_json: 1
        };
        return Http.post(Helpers.oauthBase+"/api/editusertext", data,
            [Helpers.authorizationHeader(), Helpers.userAgent(), Helpers.xWwwFormUrlEncodedContentType()],
            true).then((response: JsonResponse<JsonData<ThingsArray<"t1", CommentModel>>>) => {
                Helpers.exceptOnError(response);
                return response;
        });
    }
}
namespace Helpers {
    export const base = "https://www.reddit.com";
    export const oauthBase = "https://oauth.reddit.com";
    export function isError (response: RedditError): response is RedditError {
        if(response.hasOwnProperty("error")) {
            return true;
        }
        return false;
    }
    export function errorToString(e: RedditError) {
        return e.error +  (e.message !== undefined ? ": "+ e.message : "");
    }
    export function exceptOnError(response: any) {
        if(Helpers.isError(response)) {
            if(response.error === 401) {
                RedditMaster.reRequestAccess();
            }
            throw new RedditValiationError(Helpers.errorToString(response));
        }
    }
    export function returnExceptOnError(response: any) {
        Helpers.exceptOnError(response);
        return response;
    }
    export function authorizationHeader(): RequestHeader{
        if(StorageManager.getUserAccess().accessToken == null) {
            throw new ReferenceError("Access token is null - cannot proceed");
        }
        return new ResponseHeader("Authorization","Bearer "+StorageManager.getUserAccess().accessToken);
    }
    export function userAgent(): RequestHeader {
        navigator.appVersion
        return new ResponseHeader("User-Agent", navigator.appVersion+":red-x:v0.1"+" (by /u/xianbaum)");
    }
    export function genericOauthGet(url: string): Promise<any> {
        return Http.get(url, [Helpers.authorizationHeader(), Helpers.userAgent()])
            .then(Helpers.returnExceptOnError);
    }
    export function genericListing(url: string, list: Listing | undefined){
        let qs = list === undefined ? "" : Http.createQueryString(list);
        return Helpers.genericOauthGet(url+qs);
    }
    export function xWwwFormUrlEncodedContentType() {
        return new ResponseHeader("Content-Type", "application/x-www-form-urlencoded");
    }
}

export namespace RedditApi {
    export const clientId = "kjbqRmcCWosaig";
    export const authorizePath = "/api/v1/authorize"
    export function authorizeState() {
        return Math.floor(Math.random()*1000) + "meowmeow" + Date.now()
    }
    export function authorizeUrl() {
        return RedditApi.authorizePath +
        Http.createQueryString({
            client_id: RedditApi.clientId,
            response_type: "code",
            state: RedditApi.authorizeState(),
            redirect_uri: Helpers.base+"/",
            duration: "permanent",
            scope: "identity edit flair history modconfig modflair modlog modposts modwiki mysubreddits privatemessages read report save submit subscribe vote wikiedit wikiread"
        });
    }
    export function getAccessToken(code: string): Promise<AuthorizeResult> {
        return Http.post(Helpers.base+"/api/v1/access_token",
            "grant_type=authorization_code&code="+code+"&redirect_uri="+Helpers.base+"/",
            [new ResponseHeader("Authorization", "Basic "+btoa(RedditApi.clientId+":")),
             Helpers.userAgent(),
             new ResponseHeader("Content-Type", "application/x-www-form-urlencoded")]
        ).then(Helpers.returnExceptOnError);
    }
}

//uncomment for testing api
declare var cloneInto: any;
cloneInto( AccountApi, window, {cloneFunctions: true, wrapReflectors: true});
cloneInto( RedditApi, window, {cloneFunctions: true, wrapReflectors: true});
cloneInto( Helpers, window, {cloneFunctions: true, wrapReflectors: true});