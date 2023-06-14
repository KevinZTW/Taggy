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
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "taggy";

export interface RSSSource {
  id: string;
  name: string;
  description: string;
  url: string;
  imgUrl: string;
  lastUpdatedAt: Date | undefined;
}

export interface RSSFeed {
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

export interface ListRSSSourcesRequest {
}

export interface ListRSSSourcesReply {
  rssSources: RSSSource[];
}

export interface FetchAllRSSRequest {
}

export interface FetchAllRSSReply {
  message: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface GetRSSFeedTagsRequest {
  id: string;
}

export interface GetRSSFeedTagsReply {
  tags: Tag[];
}

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

function createBaseRSSFeed(): RSSFeed {
  return { id: "", sourceId: "", title: "", content: "", description: "", url: "", publishedAt: undefined };
}

export const RSSFeed = {
  encode(message: RSSFeed, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  fromJSON(object: any): RSSFeed {
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

  toJSON(message: RSSFeed): unknown {
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

  create<I extends Exact<DeepPartial<RSSFeed>, I>>(base?: I): RSSFeed {
    return RSSFeed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RSSFeed>, I>>(object: I): RSSFeed {
    const message = createBaseRSSFeed();
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

function createBaseGetRSSFeedTagsRequest(): GetRSSFeedTagsRequest {
  return { id: "" };
}

export const GetRSSFeedTagsRequest = {
  encode(message: GetRSSFeedTagsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSFeedTagsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSFeedTagsRequest();
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

  fromJSON(object: any): GetRSSFeedTagsRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetRSSFeedTagsRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSFeedTagsRequest>, I>>(base?: I): GetRSSFeedTagsRequest {
    return GetRSSFeedTagsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSFeedTagsRequest>, I>>(object: I): GetRSSFeedTagsRequest {
    const message = createBaseGetRSSFeedTagsRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetRSSFeedTagsReply(): GetRSSFeedTagsReply {
  return { tags: [] };
}

export const GetRSSFeedTagsReply = {
  encode(message: GetRSSFeedTagsReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.tags) {
      Tag.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRSSFeedTagsReply {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRSSFeedTagsReply();
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

  fromJSON(object: any): GetRSSFeedTagsReply {
    return { tags: Array.isArray(object?.tags) ? object.tags.map((e: any) => Tag.fromJSON(e)) : [] };
  },

  toJSON(message: GetRSSFeedTagsReply): unknown {
    const obj: any = {};
    if (message.tags) {
      obj.tags = message.tags.map((e) => e ? Tag.toJSON(e) : undefined);
    } else {
      obj.tags = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRSSFeedTagsReply>, I>>(base?: I): GetRSSFeedTagsReply {
    return GetRSSFeedTagsReply.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRSSFeedTagsReply>, I>>(object: I): GetRSSFeedTagsReply {
    const message = createBaseGetRSSFeedTagsReply();
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
  listRssSources: {
    path: "/taggy.RSSService/ListRSSSources",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListRSSSourcesRequest) => Buffer.from(ListRSSSourcesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListRSSSourcesRequest.decode(value),
    responseSerialize: (value: ListRSSSourcesReply) => Buffer.from(ListRSSSourcesReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListRSSSourcesReply.decode(value),
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
} as const;

export interface RSSServiceServer extends UntypedServiceImplementation {
  createRssSource: handleUnaryCall<CreateRSSSourceRequest, CreateRSSSourceReply>;
  listRssSources: handleUnaryCall<ListRSSSourcesRequest, ListRSSSourcesReply>;
  fetchAllRss: handleUnaryCall<FetchAllRSSRequest, FetchAllRSSReply>;
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
}

export const RSSServiceClient = makeGenericClientConstructor(RSSServiceService, "taggy.RSSService") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): RSSServiceClient;
  service: typeof RSSServiceService;
};

export type TaggingServiceService = typeof TaggingServiceService;
export const TaggingServiceService = {
  getRssFeedTags: {
    path: "/taggy.TaggingService/GetRSSFeedTags",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetRSSFeedTagsRequest) => Buffer.from(GetRSSFeedTagsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetRSSFeedTagsRequest.decode(value),
    responseSerialize: (value: GetRSSFeedTagsReply) => Buffer.from(GetRSSFeedTagsReply.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetRSSFeedTagsReply.decode(value),
  },
} as const;

export interface TaggingServiceServer extends UntypedServiceImplementation {
  getRssFeedTags: handleUnaryCall<GetRSSFeedTagsRequest, GetRSSFeedTagsReply>;
}

export interface TaggingServiceClient extends Client {
  getRssFeedTags(
    request: GetRSSFeedTagsRequest,
    callback: (error: ServiceError | null, response: GetRSSFeedTagsReply) => void,
  ): ClientUnaryCall;
  getRssFeedTags(
    request: GetRSSFeedTagsRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetRSSFeedTagsReply) => void,
  ): ClientUnaryCall;
  getRssFeedTags(
    request: GetRSSFeedTagsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetRSSFeedTagsReply) => void,
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
