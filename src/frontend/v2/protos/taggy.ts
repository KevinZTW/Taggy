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

export interface RSSSource {
  id: string;
  name: string;
  description: string;
  url: string;
  imgUrl: string;
  lastUpdatedAt: Date | undefined;
}

export interface RSSItem {
  id: string;
  sourceId: string;
  title: string;
  content: string;
  description: string;
  url: string;
  publishedAt: Date | undefined;
}

export interface CreateRSSSourceRequest {
  url: string;
}

export interface CreateRSSSourceReply {
  source: RSSSource | undefined;
}

export interface GetRSSSourceRequest {
  sourceId: string;
}

export interface GetRSSSourceReply {
  source: RSSSource | undefined;
}

export interface ListRSSSourcesRequest {
}

export interface ListRSSSourcesReply {
  rssSources: RSSSource[];
}

export interface GetRSSItemRequest {
  itemId: string;
}

export interface GetRSSItemReply {
  item: RSSItem | undefined;
}

export interface ListRSSSourceItemsRequest {
  sourceId: string;
}

export interface ListRSSSourceItemsReply {
  items: RSSItem[];
}

export interface FetchAllRSSRequest {
}

export interface FetchAllRSSReply {
  message: string;
}

export interface GetRSSItemTagsRequest {
  id: string;
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

function createBaseRSSSource(): RSSSource {
  return { id: "", name: "", description: "", url: "", imgUrl: "", lastUpdatedAt: undefined };
}

export const RSSSource = {
  encode(message: RSSSource, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): RSSSource {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRSSSource();
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

  fromJSON(object: any): RSSSource {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      url: isSet(object.url) ? String(object.url) : "",
      imgUrl: isSet(object.imgUrl) ? String(object.imgUrl) : "",
      lastUpdatedAt: isSet(object.lastUpdatedAt) ? fromJsonTimestamp(object.lastUpdatedAt) : undefined,
    };
  },

  toJSON(message: RSSSource): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined && (obj.description = message.description);
    message.url !== undefined && (obj.url = message.url);
    message.imgUrl !== undefined && (obj.imgUrl = message.imgUrl);
    message.lastUpdatedAt !== undefined && (obj.lastUpdatedAt = message.lastUpdatedAt.toISOString());
    return obj;
  },

  create<I extends Exact<DeepPartial<RSSSource>, I>>(base?: I): RSSSource {
    return RSSSource.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RSSSource>, I>>(object: I): RSSSource {
    const message = createBaseRSSSource();
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
  return { id: "", sourceId: "", title: "", content: "", description: "", url: "", publishedAt: undefined };
}

export const RSSItem = {
  encode(message: RSSItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.sourceId !== "") {
      writer.uint32(18).string(message.sourceId);
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

          message.sourceId = reader.string();
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
      sourceId: isSet(object.sourceId) ? String(object.sourceId) : "",
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
    message.sourceId !== undefined && (obj.sourceId = message.sourceId);
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
    message.sourceId = object.sourceId ?? "";
    message.title = object.title ?? "";
    message.content = object.content ?? "";
    message.description = object.description ?? "";
    message.url = object.url ?? "";
    message.publishedAt = object.publishedAt ?? undefined;
    return message;
  },
};

function createBaseCreateRSSSourceRequest(): CreateRSSSourceRequest {
  return { url: "" };
}

export const CreateRSSSourceRequest = {
  encode(message: CreateRSSSourceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRSSSourceRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateRSSSourceRequest();
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

  fromJSON(object: any): CreateRSSSourceRequest {
    return { url: isSet(object.url) ? String(object.url) : "" };
  },

  toJSON(message: CreateRSSSourceRequest): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateRSSSourceRequest>, I>>(base?: I): CreateRSSSourceRequest {
    return CreateRSSSourceRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateRSSSourceRequest>, I>>(object: I): CreateRSSSourceRequest {
    const message = createBaseCreateRSSSourceRequest();
    message.url = object.url ?? "";
    return message;
  },
};

function createBaseCreateRSSSourceReply(): CreateRSSSourceReply {
  return { source: undefined };
}

export const CreateRSSSourceReply = {
  encode(message: CreateRSSSourceReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.source !== undefined) {
      RSSSource.encode(message.source, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRSSSourceReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateRSSSourceReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.source = RSSSource.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateRSSSourceReply {
    return { source: isSet(object.source) ? RSSSource.fromJSON(object.source) : undefined };
  },

  toJSON(message: CreateRSSSourceReply): unknown {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source ? RSSSource.toJSON(message.source) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateRSSSourceReply>, I>>(base?: I): CreateRSSSourceReply {
    return CreateRSSSourceReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateRSSSourceReply>, I>>(object: I): CreateRSSSourceReply {
    const message = createBaseCreateRSSSourceReply();
    message.source = (object.source !== undefined && object.source !== null)
      ? RSSSource.fromPartial(object.source)
      : undefined;
    return message;
  },
};

function createBaseGetRSSSourceRequest(): GetRSSSourceRequest {
  return { sourceId: "" };
}

export const GetRSSSourceRequest = {
  encode(message: GetRSSSourceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sourceId !== "") {
      writer.uint32(10).string(message.sourceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSSourceRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSSourceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sourceId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRSSSourceRequest {
    return { sourceId: isSet(object.sourceId) ? String(object.sourceId) : "" };
  },

  toJSON(message: GetRSSSourceRequest): unknown {
    const obj: any = {};
    message.sourceId !== undefined && (obj.sourceId = message.sourceId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSSourceRequest>, I>>(base?: I): GetRSSSourceRequest {
    return GetRSSSourceRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSSourceRequest>, I>>(object: I): GetRSSSourceRequest {
    const message = createBaseGetRSSSourceRequest();
    message.sourceId = object.sourceId ?? "";
    return message;
  },
};

function createBaseGetRSSSourceReply(): GetRSSSourceReply {
  return { source: undefined };
}

export const GetRSSSourceReply = {
  encode(message: GetRSSSourceReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.source !== undefined) {
      RSSSource.encode(message.source, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSSourceReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSSourceReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.source = RSSSource.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetRSSSourceReply {
    return { source: isSet(object.source) ? RSSSource.fromJSON(object.source) : undefined };
  },

  toJSON(message: GetRSSSourceReply): unknown {
    const obj: any = {};
    message.source !== undefined && (obj.source = message.source ? RSSSource.toJSON(message.source) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSSourceReply>, I>>(base?: I): GetRSSSourceReply {
    return GetRSSSourceReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSSourceReply>, I>>(object: I): GetRSSSourceReply {
    const message = createBaseGetRSSSourceReply();
    message.source = (object.source !== undefined && object.source !== null)
      ? RSSSource.fromPartial(object.source)
      : undefined;
    return message;
  },
};

function createBaseListRSSSourcesRequest(): ListRSSSourcesRequest {
  return {};
}

export const ListRSSSourcesRequest = {
  encode(_: ListRSSSourcesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRSSSourcesRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRSSSourcesRequest();
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

  fromJSON(_: any): ListRSSSourcesRequest {
    return {};
  },

  toJSON(_: ListRSSSourcesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ListRSSSourcesRequest>, I>>(base?: I): ListRSSSourcesRequest {
    return ListRSSSourcesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ListRSSSourcesRequest>, I>>(_: I): ListRSSSourcesRequest {
    const message = createBaseListRSSSourcesRequest();
    return message;
  },
};

function createBaseListRSSSourcesReply(): ListRSSSourcesReply {
  return { rssSources: [] };
}

export const ListRSSSourcesReply = {
  encode(message: ListRSSSourcesReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.rssSources) {
      RSSSource.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRSSSourcesReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRSSSourcesReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.rssSources.push(RSSSource.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListRSSSourcesReply {
    return {
      rssSources: Array.isArray(object?.rssSources) ? object.rssSources.map((e: any) => RSSSource.fromJSON(e)) : [],
    };
  },

  toJSON(message: ListRSSSourcesReply): unknown {
    const obj: any = {};
    if (message.rssSources) {
      obj.rssSources = message.rssSources.map((e) => e ? RSSSource.toJSON(e) : undefined);
    } else {
      obj.rssSources = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListRSSSourcesReply>, I>>(base?: I): ListRSSSourcesReply {
    return ListRSSSourcesReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ListRSSSourcesReply>, I>>(object: I): ListRSSSourcesReply {
    const message = createBaseListRSSSourcesReply();
    message.rssSources = object.rssSources?.map((e) => RSSSource.fromPartial(e)) || [];
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

function createBaseListRSSSourceItemsRequest(): ListRSSSourceItemsRequest {
  return { sourceId: "" };
}

export const ListRSSSourceItemsRequest = {
  encode(message: ListRSSSourceItemsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sourceId !== "") {
      writer.uint32(10).string(message.sourceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRSSSourceItemsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRSSSourceItemsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sourceId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListRSSSourceItemsRequest {
    return { sourceId: isSet(object.sourceId) ? String(object.sourceId) : "" };
  },

  toJSON(message: ListRSSSourceItemsRequest): unknown {
    const obj: any = {};
    message.sourceId !== undefined && (obj.sourceId = message.sourceId);
    return obj;
  },

  create<I extends Exact<DeepPartial<ListRSSSourceItemsRequest>, I>>(base?: I): ListRSSSourceItemsRequest {
    return ListRSSSourceItemsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ListRSSSourceItemsRequest>, I>>(object: I): ListRSSSourceItemsRequest {
    const message = createBaseListRSSSourceItemsRequest();
    message.sourceId = object.sourceId ?? "";
    return message;
  },
};

function createBaseListRSSSourceItemsReply(): ListRSSSourceItemsReply {
  return { items: [] };
}

export const ListRSSSourceItemsReply = {
  encode(message: ListRSSSourceItemsReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.items) {
      RSSItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListRSSSourceItemsReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListRSSSourceItemsReply();
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

  fromJSON(object: any): ListRSSSourceItemsReply {
    return { items: Array.isArray(object?.items) ? object.items.map((e: any) => RSSItem.fromJSON(e)) : [] };
  },

  toJSON(message: ListRSSSourceItemsReply): unknown {
    const obj: any = {};
    if (message.items) {
      obj.items = message.items.map((e) => e ? RSSItem.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ListRSSSourceItemsReply>, I>>(base?: I): ListRSSSourceItemsReply {
    return ListRSSSourceItemsReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ListRSSSourceItemsReply>, I>>(object: I): ListRSSSourceItemsReply {
    const message = createBaseListRSSSourceItemsReply();
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
  return { id: "" };
}

export const GetRSSItemTagsRequest = {
  encode(message: GetRSSItemTagsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
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

          message.id = reader.string();
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
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetRSSItemTagsRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSItemTagsRequest>, I>>(base?: I): GetRSSItemTagsRequest {
    return GetRSSItemTagsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSItemTagsRequest>, I>>(object: I): GetRSSItemTagsRequest {
    const message = createBaseGetRSSItemTagsRequest();
    message.id = object.id ?? "";
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
  createRssSource: {
    path: "/taggy.RSSService/CreateRSSSource",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateRSSSourceRequest) => Buffer.from(CreateRSSSourceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateRSSSourceRequest.decode(value),
    responseSerialize: (value: CreateRSSSourceReply) => Buffer.from(CreateRSSSourceReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateRSSSourceReply.decode(value),
  },
  getRssSource: {
    path: "/taggy.RSSService/GetRSSSource",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetRSSSourceRequest) => Buffer.from(GetRSSSourceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetRSSSourceRequest.decode(value),
    responseSerialize: (value: GetRSSSourceReply) => Buffer.from(GetRSSSourceReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetRSSSourceReply.decode(value),
  },
  listRssSources: {
    path: "/taggy.RSSService/ListRSSSources",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListRSSSourcesRequest) => Buffer.from(ListRSSSourcesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListRSSSourcesRequest.decode(value),
    responseSerialize: (value: ListRSSSourcesReply) => Buffer.from(ListRSSSourcesReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListRSSSourcesReply.decode(value),
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
  listRssSourceItems: {
    path: "/taggy.RSSService/ListRSSSourceItems",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListRSSSourceItemsRequest) =>
      Buffer.from(ListRSSSourceItemsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListRSSSourceItemsRequest.decode(value),
    responseSerialize: (value: ListRSSSourceItemsReply) => Buffer.from(ListRSSSourceItemsReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListRSSSourceItemsReply.decode(value),
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
  createRssSource: handleUnaryCall<CreateRSSSourceRequest, CreateRSSSourceReply>;
  getRssSource: handleUnaryCall<GetRSSSourceRequest, GetRSSSourceReply>;
  listRssSources: handleUnaryCall<ListRSSSourcesRequest, ListRSSSourcesReply>;
  getRssItem: handleUnaryCall<GetRSSItemRequest, GetRSSItemReply>;
  listRssSourceItems: handleUnaryCall<ListRSSSourceItemsRequest, ListRSSSourceItemsReply>;
  fetchAllRss: handleUnaryCall<FetchAllRSSRequest, FetchAllRSSReply>;
  /** To support local test only */
  forceFetchOriginItems: handleUnaryCall<Empty, Empty>;
}

export interface RSSServiceClient extends Client {
  createRssSource(
    request: CreateRSSSourceRequest,
    callback: (error: ServiceError | null, response: CreateRSSSourceReply) => void,
  ): ClientUnaryCall;
  createRssSource(
    request: CreateRSSSourceRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CreateRSSSourceReply) => void,
  ): ClientUnaryCall;
  createRssSource(
    request: CreateRSSSourceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CreateRSSSourceReply) => void,
  ): ClientUnaryCall;
  getRssSource(
    request: GetRSSSourceRequest,
    callback: (error: ServiceError | null, response: GetRSSSourceReply) => void,
  ): ClientUnaryCall;
  getRssSource(
    request: GetRSSSourceRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetRSSSourceReply) => void,
  ): ClientUnaryCall;
  getRssSource(
    request: GetRSSSourceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetRSSSourceReply) => void,
  ): ClientUnaryCall;
  listRssSources(
    request: ListRSSSourcesRequest,
    callback: (error: ServiceError | null, response: ListRSSSourcesReply) => void,
  ): ClientUnaryCall;
  listRssSources(
    request: ListRSSSourcesRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ListRSSSourcesReply) => void,
  ): ClientUnaryCall;
  listRssSources(
    request: ListRSSSourcesRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ListRSSSourcesReply) => void,
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
  listRssSourceItems(
    request: ListRSSSourceItemsRequest,
    callback: (error: ServiceError | null, response: ListRSSSourceItemsReply) => void,
  ): ClientUnaryCall;
  listRssSourceItems(
    request: ListRSSSourceItemsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ListRSSSourceItemsReply) => void,
  ): ClientUnaryCall;
  listRssSourceItems(
    request: ListRSSSourceItemsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ListRSSSourceItemsReply) => void,
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

export type TaggingServiceService = typeof TaggingServiceService;
export const TaggingServiceService = {
  getRssItemTags: {
    path: "/taggy.TaggingService/GetRSSItemTags",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetRSSItemTagsRequest) => Buffer.from(GetRSSItemTagsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetRSSItemTagsRequest.decode(value),
    responseSerialize: (value: GetRSSItemTagsReply) => Buffer.from(GetRSSItemTagsReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetRSSItemTagsReply.decode(value),
  },
} as const;

export interface TaggingServiceServer extends UntypedServiceImplementation {
  getRssItemTags: handleUnaryCall<GetRSSItemTagsRequest, GetRSSItemTagsReply>;
}

export interface TaggingServiceClient extends Client {
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

export const TaggingServiceClient = makeGenericClientConstructor(
  TaggingServiceService,
  "taggy.TaggingService",
) as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): TaggingServiceClient;
  service: typeof TaggingServiceService;
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
