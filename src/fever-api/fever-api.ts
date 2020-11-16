/*The default response is a JSON object containing two members:

api_version contains the version of the API responding (positive integer)
auth whether the request was successfully authenticated (boolean integer)*/

import { Injectable } from '@nestjs/common';

export interface auth_result {
    api_version: number;
    auth: boolean;
}

/*An item object has the following members:

id (positive integer)
feed_id (positive integer)
title (utf-8 string)
author (utf-8 string)
html (utf-8 string)
url (utf-8 string)
is_saved (boolean integer)
is_read (boolean integer)
created_on_time (Unix timestamp/integer)*/
export interface item {
    id: number;
    feed_id: number;
    title: string;
    author: string;
    html: string;
    url: string;
    is_saved: boolean;
    is_read: boolean;
    created_on_time: number;
}

/*A request with the items argument will return two additional members:

items contains an array of item objects
total_items contains the total number of items stored in the database (added in API version 2)*/
export interface items_result {
    items: item[];
    total_items: number;
}

/*A feed object has the following members:

id (positive integer)
favicon_id (positive integer)
title (utf-8 string)
url (utf-8 string)
site_url (utf-8 string)
is_spark (boolean integer)
last_updated_on_time (Unix timestamp/integer)
The feeds_group object is documented under “Feeds/Groups Relationships.”

The “All Items” super feed is not included in this response and is composed of all items from all feeds that belong to a given group. For the “Kindling” super group and all user created groups the items should be limited to feeds with an is_spark equal to 0. For the “Sparks” super group the items should be limited to feeds with an is_spark equal to 1.*/
export interface feed {
    id: number;
    favicon_id: number;
    title: string;
    url: string;
    site_url: string;
    is_spark: boolean;
    last_updated_on_time: number;
}

/**
 * Feeds/Groups Relationships
 * A request with either the groups or feeds arguments will return an additional member:
 * A feeds_group object has the following members:
 * */
export interface feeds_group {
    group_id: number; //(positive integer)
    feed_ids: string; //(string/comma-separated list of positive integers)
}

/*A request with the feeds argument will return two additional members:

feeds contains an array of group objects
feeds_groups contains an array of feeds_group objects*/
export interface feeds_result {
    feeds: feed[];
    feeds_groups: [];
}

/*favicons contains an array of favicon objects
A favicon object has the following members:

id (positive integer)
data (base64 encoded image data; prefixed by image type)*/
export interface favicons {
    id: number;
    data: string;
}

export interface favicons_result {
    favicons: [];
}

export interface unread_item_ids_result {
    unread_item_ids: string;
}

export interface saved_item_ids_result {
    saved_item_ids: string;
}

export interface items_args {
    since_id?: number;
    max_id?: number;
    with_ids?: string;
}

/**
 * @see https://feedafever.com/api
 * */
@Injectable()
export abstract class FeverApi {
    abstract auth(): Promise<auth_result>;

    abstract items(args: items_args): Promise<items_result>;

    abstract feeds(): Promise<feeds_result>;

    abstract groups(): Promise<groups_result>;

    abstract favicons(): Promise<favicons_result>;

    abstract unread_item_ids(): Promise<unread_item_ids_result>;

    abstract saved_item_ids(): Promise<saved_item_ids_result>;

    abstract post(args: any, body: any): Promise<any>;

    abstract links(): Promise<links_result>;
}

/*
A group object has the following members:

id (positive integer)
title (utf-8 string)
*/
export interface group {
    id: number;
    title: string;
}

export interface groups_result {
    groups: group[];
    feeds_groups: feeds_group[];
}

/*A link object has the following members:

id (positive integer)
feed_id (positive integer) only use when is_item equals 1
item_id (positive integer) only use when is_item equals 1
temperature (positive float)
is_item (boolean integer)
is_local (boolean integer) used to determine if the source feed and favicon should be displayed
is_saved (boolean integer) only use when is_item equals 1
title (utf-8 string)
url (utf-8 string)
item_ids (string/comma-separated list of positive integers)*/
export interface link {
    id: number;

    temperature: number;
    is_item: boolean;
    is_local: boolean;
    title: string;
    url: string;
    item_ids: string;
}

export interface item_link extends link {
    feed_id: number;
    item_id: number;
    is_saved: boolean;
}

export interface links_result {
    links: (item_link | link)[];
}
