/* eslint-disable */
import {
  CallOptions,
  ChannelCredentials,
  Client,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  makeGenericClientConstructor,
  Metadata,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Empty } from "./google/protobuf/empty";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "taggy";

export interface Tag {
  id: string;
  name: string;
}

export interface RSSFeed {
  id: string;
  name: string;
  description: string;
  url: string;
  imgUrl: string;
  lastUpdatedAt: Date | undefined;
}

export interface RSSItem {
  id: string;
  feedId: string;
  title: string;
  content: string;
  description: string;
  url: string;
  publishedAt: Date | undefined;
}

export interface CreateRSSFeedRequest {
  url: string;
}

export interface CreateRSSFeedReply {
  feed: RSSFeed | undefined;
}

export interface GetRSSFeedRequest {
  feedId: string;
}

export interface GetRSSFeedReply {
  feed: RSSFeed | undefined;
}

export interface ListRSSFeedsRequest {
}

export interface ListRSSFeedsReply {
  feeds: RSSFeed[];
}

export interface GetRSSItemRequest {
  itemId: string;
}

export interface GetRSSItemReply {
  item: RSSItem | undefined;
}

export interface ListRSSFeedItemsRequest {
  feedId: string;
}

export interface ListRSSFeedItemsReply {
  items: RSSItem[];
}

export interface FetchAllRSSRequest {
}

export interface FetchAllRSSReply {
  message: string;
}

export interface GetRSSItemTagsRequest {
  itemId: string;
}

export interface GetRSSItemTagsReply {
  tags: Tag[];
}

function createBaseTag(): Tag {
  return { id: "", name: "" };
}

export const Tag = {
  encode(message: Tag, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Tag {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTag();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Tag {
    return { id: isSet(object.id) ? String(object.id) : "", name: isSet(object.name) ? String(object.name) : "" };
  },

  toJSON(message: Tag): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  create<I extends Exact<DeepPartial<Tag>, I>>(base?: I): Tag {
    return Tag.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Tag>, I>>(object: I): Tag {
    const message = createBaseTag();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseRSSFeed(): RSSFeed {
  return { id: "", name: "", description: "", url: "", imgUrl: "", lastUpdatedAt: undefined };
}

export const RSSFeed = {
  encode(message: RSSFeed, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.url !== "") {
      writer.uint32(34).string(message.url);
    }
    if (message.imgUrl !== "") {
      writer.uint32(42).string(message.imgUrl);
    }
    if (message.lastUpdatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.lastUpdatedAt), writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RSSFeed {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRSSFeed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.name = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.description = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.url = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.imgUrl = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.lastUpdatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RSSFeed {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      url: isSet(object.url) ? String(object.url) : "",
      imgUrl: isSet(object.imgUrl) ? String(object.imgUrl) : "",
      lastUpdatedAt: isSet(object.lastUpdatedAt) ? fromJsonTimestamp(object.lastUpdatedAt) : undefined,
    };
  },

  toJSON(message: RSSFeed): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.url !== undefined && (obj.url = message.url);
    message.imgUrl !== undefined && (obj.imgUrl = message.imgUrl);
    message.lastUpdatedAt !== undefined && (obj.lastUpdatedAt = message.lastUpdatedAt.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<RSSFeed>, I>>(base?: I): RSSFeed {
    return RSSFeed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RSSFeed>, I>>(object: I): RSSFeed {
    const message = createBaseRSSFeed();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.url = object.url ?? "";
    message.imgUrl = object.imgUrl ?? "";
    message.lastUpdatedAt = object.lastUpdatedAt ?? undefined;
    return message;
  },
};

function createBaseRSSItem(): RSSItem {
  return { id: "", feedId: "", title: "", content: "", description: "", url: "", publishedAt: undefined };
}

export const RSSItem = {
  encode(message: RSSItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.feedId !== "") {
      writer.uint32(18).string(message.feedId);
    }
    if (message.title !== "") {
      writer.uint32(26).string(message.title);
    }
    if (message.content !== "") {
      writer.uint32(34).string(message.content);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.url !== "") {
      writer.uint32(50).string(message.url);
    }
    if (message.publishedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.publishedAt), writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RSSItem {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRSSItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.feedId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.title = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.content = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.description = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.url = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.publishedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RSSItem {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      feedId: isSet(object.feedId) ? String(object.feedId) : "",
      title: isSet(object.title) ? String(object.title) : "",
      content: isSet(object.content) ? String(object.content) : "",
      description: isSet(object.description) ? String(object.description) : "",
      url: isSet(object.url) ? String(object.url) : "",
      publishedAt: isSet(object.publishedAt) ? fromJsonTimestamp(object.publishedAt) : undefined,
    };
  },

  toJSON(message: RSSItem): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.feedId !== undefined && (obj.feedId = message.feedId);
    message.title !== undefined && (obj.title = message.title);
    message.content !== undefined && (obj.content = message.content);
    message.description !== undefined && (obj.description = message.description);
    message.url !== undefined && (obj.url = message.url);
    message.publishedAt !== undefined && (obj.publishedAt = message.publishedAt.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<RSSItem>, I>>(base?: I): RSSItem {
    return RSSItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RSSItem>, I>>(object: I): RSSItem {
    const message = createBaseRSSItem();
    message.id = object.id ?? "";
    message.feedId = object.feedId ?? "";
    message.title = object.title ?? "";
    message.content = object.content ?? "";
    message.description = object.description ?? "";
    message.url = object.url ?? "";
    message.publishedAt = object.publishedAt ?? undefined;
    return message;
  },
};

function createBaseCreateRSSFeedRequest(): CreateRSSFeedRequest {
  return { url: "" };
}

export const CreateRSSFeedRequest = {
  encode(message: CreateRSSFeedRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRSSFeedRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateRSSFeedRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.url = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateRSSFeedRequest {
    return { url: isSet(object.url) ? String(object.url) : "" };
  },

  toJSON(message: CreateRSSFeedRequest): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateRSSFeedRequest>, I>>(base?: I): CreateRSSFeedRequest {
    return CreateRSSFeedRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateRSSFeedRequest>, I>>(object: I): CreateRSSFeedRequest {
    const message = createBaseCreateRSSFeedRequest();
    message.url = object.url ?? "";
    return message;
  },
};

function createBaseCreateRSSFeedReply(): CreateRSSFeedReply {
  return { feed: undefined };
}

export const CreateRSSFeedReply = {
  encode(message: CreateRSSFeedReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.feed !== undefined) {
      RSSFeed.encode(message.feed, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRSSFeedReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateRSSFeedReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.feed = RSSFeed.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateRSSFeedReply {
    return { feed: isSet(object.feed) ? RSSFeed.fromJSON(object.feed) : undefined };
  },

  toJSON(message: CreateRSSFeedReply): unknown {
    const obj: any = {};
    message.feed !== undefined && (obj.feed = message.feed ? RSSFeed.toJSON(message.feed) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateRSSFeedReply>, I>>(base?: I): CreateRSSFeedReply {
    return CreateRSSFeedReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateRSSFeedReply>, I>>(object: I): CreateRSSFeedReply {
    const message = createBaseCreateRSSFeedReply();
    message.feed = (object.feed !== undefined && object.feed !== null) ? RSSFeed.fromPartial(object.feed) : undefined;
    return message;
  },
};

function createBaseGetRSSFeedRequest(): GetRSSFeedRequest {
  return { feedId: "" };
}

export const GetRSSFeedRequest = {
  encode(message: GetRSSFeedRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.feedId !== "") {
      writer.uint32(10).string(message.feedId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSFeedRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSFeedRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.feedId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRSSFeedRequest {
    return { feedId: isSet(object.feedId) ? String(object.feedId) : "" };
  },

  toJSON(message: GetRSSFeedRequest): unknown {
    const obj: any = {};
    message.feedId !== undefined && (obj.feedId = message.feedId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSFeedRequest>, I>>(base?: I): GetRSSFeedRequest {
    return GetRSSFeedRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSFeedRequest>, I>>(object: I): GetRSSFeedRequest {
    const message = createBaseGetRSSFeedRequest();
    message.feedId = object.feedId ?? "";
    return message;
  },
};

function createBaseGetRSSFeedReply(): GetRSSFeedReply {
  return { feed: undefined };
}

export const GetRSSFeedReply = {
  encode(message: GetRSSFeedReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.feed !== undefined) {
      RSSFeed.encode(message.feed, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSFeedReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSFeedReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.feed = RSSFeed.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRSSFeedReply {
    return { feed: isSet(object.feed) ? RSSFeed.fromJSON(object.feed) : undefined };
  },

  toJSON(message: GetRSSFeedReply): unknown {
    const obj: any = {};
    message.feed !== undefined && (obj.feed = message.feed ? RSSFeed.toJSON(message.feed) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSFeedReply>, I>>(base?: I): GetRSSFeedReply {
    return GetRSSFeedReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSFeedReply>, I>>(object: I): GetRSSFeedReply {
    const message = createBaseGetRSSFeedReply();
    message.feed = (object.feed !== undefined && object.feed !== null) ? RSSFeed.fromPartial(object.feed) : undefined;
    return message;
  },
};

function createBaseListRSSFeedsRequest(): ListRSSFeedsRequest {
  return {};
}

export const ListRSSFeedsRequest = {
  encode(_: ListRSSFeedsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRSSFeedsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRSSFeedsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): ListRSSFeedsRequest {
    return {};
  },

  toJSON(_: ListRSSFeedsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ListRSSFeedsRequest>, I>>(base?: I): ListRSSFeedsRequest {
    return ListRSSFeedsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ListRSSFeedsRequest>, I>>(_: I): ListRSSFeedsRequest {
    const message = createBaseListRSSFeedsRequest();
    return message;
  },
};

function createBaseListRSSFeedsReply(): ListRSSFeedsReply {
  return { feeds: [] };
}

export const ListRSSFeedsReply = {
  encode(message: ListRSSFeedsReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.feeds) {
      RSSFeed.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRSSFeedsReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRSSFeedsReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.feeds.push(RSSFeed.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListRSSFeedsReply {
    return { feeds: Array.isArray(object?.feeds) ? object.feeds.map((e: any) => RSSFeed.fromJSON(e)) : [] };
  },

  toJSON(message: ListRSSFeedsReply): unknown {
    const obj: any = {};
    if (message.feeds) {
      obj.feeds = message.feeds.map((e) => e ? RSSFeed.toJSON(e) : undefined);
    } else {
      obj.feeds = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListRSSFeedsReply>, I>>(base?: I): ListRSSFeedsReply {
    return ListRSSFeedsReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ListRSSFeedsReply>, I>>(object: I): ListRSSFeedsReply {
    const message = createBaseListRSSFeedsReply();
    message.feeds = object.feeds?.map((e) => RSSFeed.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetRSSItemRequest(): GetRSSItemRequest {
  return { itemId: "" };
}

export const GetRSSItemRequest = {
  encode(message: GetRSSItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== "") {
      writer.uint32(10).string(message.itemId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.itemId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRSSItemRequest {
    return { itemId: isSet(object.itemId) ? String(object.itemId) : "" };
  },

  toJSON(message: GetRSSItemRequest): unknown {
    const obj: any = {};
    message.itemId !== undefined && (obj.itemId = message.itemId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSItemRequest>, I>>(base?: I): GetRSSItemRequest {
    return GetRSSItemRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSItemRequest>, I>>(object: I): GetRSSItemRequest {
    const message = createBaseGetRSSItemRequest();
    message.itemId = object.itemId ?? "";
    return message;
  },
};

function createBaseGetRSSItemReply(): GetRSSItemReply {
  return { item: undefined };
}

export const GetRSSItemReply = {
  encode(message: GetRSSItemReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.item !== undefined) {
      RSSItem.encode(message.item, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSItemReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSItemReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.item = RSSItem.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRSSItemReply {
    return { item: isSet(object.item) ? RSSItem.fromJSON(object.item) : undefined };
  },

  toJSON(message: GetRSSItemReply): unknown {
    const obj: any = {};
    message.item !== undefined && (obj.item = message.item ? RSSItem.toJSON(message.item) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSItemReply>, I>>(base?: I): GetRSSItemReply {
    return GetRSSItemReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSItemReply>, I>>(object: I): GetRSSItemReply {
    const message = createBaseGetRSSItemReply();
    message.item = (object.item !== undefined && object.item !== null) ? RSSItem.fromPartial(object.item) : undefined;
    return message;
  },
};

function createBaseListRSSFeedItemsRequest(): ListRSSFeedItemsRequest {
  return { feedId: "" };
}

export const ListRSSFeedItemsRequest = {
  encode(message: ListRSSFeedItemsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.feedId !== "") {
      writer.uint32(10).string(message.feedId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRSSFeedItemsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRSSFeedItemsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.feedId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListRSSFeedItemsRequest {
    return { feedId: isSet(object.feedId) ? String(object.feedId) : "" };
  },

  toJSON(message: ListRSSFeedItemsRequest): unknown {
    const obj: any = {};
    message.feedId !== undefined && (obj.feedId = message.feedId);
    return obj;
  },

  create<I extends Exact<DeepPartial<ListRSSFeedItemsRequest>, I>>(base?: I): ListRSSFeedItemsRequest {
    return ListRSSFeedItemsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ListRSSFeedItemsRequest>, I>>(object: I): ListRSSFeedItemsRequest {
    const message = createBaseListRSSFeedItemsRequest();
    message.feedId = object.feedId ?? "";
    return message;
  },
};

function createBaseListRSSFeedItemsReply(): ListRSSFeedItemsReply {
  return { items: [] };
}

export const ListRSSFeedItemsReply = {
  encode(message: ListRSSFeedItemsReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.items) {
      RSSItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRSSFeedItemsReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRSSFeedItemsReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.items.push(RSSItem.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListRSSFeedItemsReply {
    return { items: Array.isArray(object?.items) ? object.items.map((e: any) => RSSItem.fromJSON(e)) : [] };
  },

  toJSON(message: ListRSSFeedItemsReply): unknown {
    const obj: any = {};
    if (message.items) {
      obj.items = message.items.map((e) => e ? RSSItem.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListRSSFeedItemsReply>, I>>(base?: I): ListRSSFeedItemsReply {
    return ListRSSFeedItemsReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ListRSSFeedItemsReply>, I>>(object: I): ListRSSFeedItemsReply {
    const message = createBaseListRSSFeedItemsReply();
    message.items = object.items?.map((e) => RSSItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseFetchAllRSSRequest(): FetchAllRSSRequest {
  return {};
}

export const FetchAllRSSRequest = {
  encode(_: FetchAllRSSRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FetchAllRSSRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchAllRSSRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): FetchAllRSSRequest {
    return {};
  },

  toJSON(_: FetchAllRSSRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchAllRSSRequest>, I>>(base?: I): FetchAllRSSRequest {
    return FetchAllRSSRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FetchAllRSSRequest>, I>>(_: I): FetchAllRSSRequest {
    const message = createBaseFetchAllRSSRequest();
    return message;
  },
};

function createBaseFetchAllRSSReply(): FetchAllRSSReply {
  return { message: "" };
}

export const FetchAllRSSReply = {
  encode(message: FetchAllRSSReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message !== "") {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FetchAllRSSReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchAllRSSReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FetchAllRSSReply {
    return { message: isSet(object.message) ? String(object.message) : "" };
  },

  toJSON(message: FetchAllRSSReply): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchAllRSSReply>, I>>(base?: I): FetchAllRSSReply {
    return FetchAllRSSReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FetchAllRSSReply>, I>>(object: I): FetchAllRSSReply {
    const message = createBaseFetchAllRSSReply();
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseGetRSSItemTagsRequest(): GetRSSItemTagsRequest {
  return { itemId: "" };
}

export const GetRSSItemTagsRequest = {
  encode(message: GetRSSItemTagsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== "") {
      writer.uint32(10).string(message.itemId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSItemTagsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSItemTagsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.itemId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRSSItemTagsRequest {
    return { itemId: isSet(object.itemId) ? String(object.itemId) : "" };
  },

  toJSON(message: GetRSSItemTagsRequest): unknown {
    const obj: any = {};
    message.itemId !== undefined && (obj.itemId = message.itemId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSItemTagsRequest>, I>>(base?: I): GetRSSItemTagsRequest {
    return GetRSSItemTagsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSItemTagsRequest>, I>>(object: I): GetRSSItemTagsRequest {
    const message = createBaseGetRSSItemTagsRequest();
    message.itemId = object.itemId ?? "";
    return message;
  },
};

function createBaseGetRSSItemTagsReply(): GetRSSItemTagsReply {
  return { tags: [] };
}

export const GetRSSItemTagsReply = {
  encode(message: GetRSSItemTagsReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.tags) {
      Tag.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSItemTagsReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSItemTagsReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tags.push(Tag.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRSSItemTagsReply {
    return { tags: Array.isArray(object?.tags) ? object.tags.map((e: any) => Tag.fromJSON(e)) : [] };
  },

  toJSON(message: GetRSSItemTagsReply): unknown {
    const obj: any = {};
    if (message.tags) {
      obj.tags = message.tags.map((e) => e ? Tag.toJSON(e) : undefined);
    } else {
      obj.tags = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSItemTagsReply>, I>>(base?: I): GetRSSItemTagsReply {
    return GetRSSItemTagsReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSItemTagsReply>, I>>(object: I): GetRSSItemTagsReply {
    const message = createBaseGetRSSItemTagsReply();
    message.tags = object.tags?.map((e) => Tag.fromPartial(e)) || [];
    return message;
  },
};

export type RSSServiceService = typeof RSSServiceService;
export const RSSServiceService = {
  createRssFeed: {
    path: "/taggy.RSSService/CreateRSSFeed",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateRSSFeedRequest) => Buffer.from(CreateRSSFeedRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateRSSFeedRequest.decode(value),
    responseSerialize: (value: CreateRSSFeedReply) => Buffer.from(CreateRSSFeedReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateRSSFeedReply.decode(value),
  },
  getRssFeed: {
    path: "/taggy.RSSService/GetRSSFeed",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetRSSFeedRequest) => Buffer.from(GetRSSFeedRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetRSSFeedRequest.decode(value),
    responseSerialize: (value: GetRSSFeedReply) => Buffer.from(GetRSSFeedReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetRSSFeedReply.decode(value),
  },
  listRssFeeds: {
    path: "/taggy.RSSService/ListRSSFeeds",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListRSSFeedsRequest) => Buffer.from(ListRSSFeedsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListRSSFeedsRequest.decode(value),
    responseSerialize: (value: ListRSSFeedsReply) => Buffer.from(ListRSSFeedsReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListRSSFeedsReply.decode(value),
  },
  getRssItem: {
    path: "/taggy.RSSService/GetRSSItem",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetRSSItemRequest) => Buffer.from(GetRSSItemRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetRSSItemRequest.decode(value),
    responseSerialize: (value: GetRSSItemReply) => Buffer.from(GetRSSItemReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetRSSItemReply.decode(value),
  },
  listRssFeedItems: {
    path: "/taggy.RSSService/ListRSSFeedItems",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListRSSFeedItemsRequest) => Buffer.from(ListRSSFeedItemsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListRSSFeedItemsRequest.decode(value),
    responseSerialize: (value: ListRSSFeedItemsReply) => Buffer.from(ListRSSFeedItemsReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListRSSFeedItemsReply.decode(value),
  },
  fetchAllRss: {
    path: "/taggy.RSSService/FetchAllRSS",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: FetchAllRSSRequest) => Buffer.from(FetchAllRSSRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => FetchAllRSSRequest.decode(value),
    responseSerialize: (value: FetchAllRSSReply) => Buffer.from(FetchAllRSSReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => FetchAllRSSReply.decode(value),
  },
  /** To support local test only */
  forceFetchOriginItems: {
    path: "/taggy.RSSService/ForceFetchOriginItems",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    requestDeserialize: (value: Buffer) => Empty.decode(value),
    responseSerialize: (value: Empty) => Buffer.from(Empty.encode(value).finish()),
    responseDeserialize: (value: Buffer) => Empty.decode(value),
  },
} as const;

export interface RSSServiceServer extends UntypedServiceImplementation {
  createRssFeed: handleUnaryCall<CreateRSSFeedRequest, CreateRSSFeedReply>;
  getRssFeed: handleUnaryCall<GetRSSFeedRequest, GetRSSFeedReply>;
  listRssFeeds: handleUnaryCall<ListRSSFeedsRequest, ListRSSFeedsReply>;
  getRssItem: handleUnaryCall<GetRSSItemRequest, GetRSSItemReply>;
  listRssFeedItems: handleUnaryCall<ListRSSFeedItemsRequest, ListRSSFeedItemsReply>;
  fetchAllRss: handleUnaryCall<FetchAllRSSRequest, FetchAllRSSReply>;
  /** To support local test only */
  forceFetchOriginItems: handleUnaryCall<Empty, Empty>;
}

export interface RSSServiceClient extends Client {
  createRssFeed(
    request: CreateRSSFeedRequest,
    callback: (error: ServiceError | null, response: CreateRSSFeedReply) => void,
  ): ClientUnaryCall;
  createRssFeed(
    request: CreateRSSFeedRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CreateRSSFeedReply) => void,
  ): ClientUnaryCall;
  createRssFeed(
    request: CreateRSSFeedRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CreateRSSFeedReply) => void,
  ): ClientUnaryCall;
  getRssFeed(
    request: GetRSSFeedRequest,
    callback: (error: ServiceError | null, response: GetRSSFeedReply) => void,
  ): ClientUnaryCall;
  getRssFeed(
    request: GetRSSFeedRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetRSSFeedReply) => void,
  ): ClientUnaryCall;
  getRssFeed(
    request: GetRSSFeedRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetRSSFeedReply) => void,
  ): ClientUnaryCall;
  listRssFeeds(
    request: ListRSSFeedsRequest,
    callback: (error: ServiceError | null, response: ListRSSFeedsReply) => void,
  ): ClientUnaryCall;
  listRssFeeds(
    request: ListRSSFeedsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ListRSSFeedsReply) => void,
  ): ClientUnaryCall;
  listRssFeeds(
    request: ListRSSFeedsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ListRSSFeedsReply) => void,
  ): ClientUnaryCall;
  getRssItem(
    request: GetRSSItemRequest,
    callback: (error: ServiceError | null, response: GetRSSItemReply) => void,
  ): ClientUnaryCall;
  getRssItem(
    request: GetRSSItemRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetRSSItemReply) => void,
  ): ClientUnaryCall;
  getRssItem(
    request: GetRSSItemRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetRSSItemReply) => void,
  ): ClientUnaryCall;
  listRssFeedItems(
    request: ListRSSFeedItemsRequest,
    callback: (error: ServiceError | null, response: ListRSSFeedItemsReply) => void,
  ): ClientUnaryCall;
  listRssFeedItems(
    request: ListRSSFeedItemsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ListRSSFeedItemsReply) => void,
  ): ClientUnaryCall;
  listRssFeedItems(
    request: ListRSSFeedItemsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ListRSSFeedItemsReply) => void,
  ): ClientUnaryCall;
  fetchAllRss(
    request: FetchAllRSSRequest,
    callback: (error: ServiceError | null, response: FetchAllRSSReply) => void,
  ): ClientUnaryCall;
  fetchAllRss(
    request: FetchAllRSSRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: FetchAllRSSReply) => void,
  ): ClientUnaryCall;
  fetchAllRss(
    request: FetchAllRSSRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: FetchAllRSSReply) => void,
  ): ClientUnaryCall;
  /** To support local test only */
  forceFetchOriginItems(
    request: Empty,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  forceFetchOriginItems(
    request: Empty,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
  forceFetchOriginItems(
    request: Empty,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: Empty) => void,
  ): ClientUnaryCall;
}

export const RSSServiceClient = makeGenericClientConstructor(RSSServiceService, "taggy.RSSService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): RSSServiceClient;
  service: typeof RSSServiceService;
};

export type RecommendationServiceService = typeof RecommendationServiceService;
export const RecommendationServiceService = {
  getRssItemTags: {
    path: "/taggy.RecommendationService/GetRSSItemTags",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetRSSItemTagsRequest) => Buffer.from(GetRSSItemTagsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetRSSItemTagsRequest.decode(value),
    responseSerialize: (value: GetRSSItemTagsReply) => Buffer.from(GetRSSItemTagsReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetRSSItemTagsReply.decode(value),
  },
} as const;

export interface RecommendationServiceServer extends UntypedServiceImplementation {
  getRssItemTags: handleUnaryCall<GetRSSItemTagsRequest, GetRSSItemTagsReply>;
}

export interface RecommendationServiceClient extends Client {
  getRssItemTags(
    request: GetRSSItemTagsRequest,
    callback: (error: ServiceError | null, response: GetRSSItemTagsReply) => void,
  ): ClientUnaryCall;
  getRssItemTags(
    request: GetRSSItemTagsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetRSSItemTagsReply) => void,
  ): ClientUnaryCall;
  getRssItemTags(
    request: GetRSSItemTagsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetRSSItemTagsReply) => void,
  ): ClientUnaryCall;
}

export const RecommendationServiceClient = makeGenericClientConstructor(
  RecommendationServiceService,
  "taggy.RecommendationService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): RecommendationServiceClient;
  service: typeof RecommendationServiceService;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
