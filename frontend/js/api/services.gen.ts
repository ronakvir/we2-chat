// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import type {
  ChatroomListData,
  ChatroomListResponse,
  ChatroomCreateData,
  ChatroomCreateResponse,
  ChatroomRetrieveData,
  ChatroomRetrieveResponse,
  ChatroomUpdateData,
  ChatroomUpdateResponse,
  ChatroomPartialUpdateData,
  ChatroomPartialUpdateResponse,
  ChatroomDestroyData,
  ChatroomDestroyResponse,
  ChatroomsJoinCreateData,
  ChatroomsJoinCreateResponse,
  ChatroomsLeaveCreateData,
  ChatroomsLeaveCreateResponse,
  ChatroomsTop5RetrieveResponse,
  EventsCreateCreateData,
  EventsCreateCreateResponse,
  RestRestCheckRetrieveResponse,
  UsersListData,
  UsersListResponse,
  UsersCreateData,
  UsersCreateResponse,
  UsersRetrieveData,
  UsersRetrieveResponse,
  UsersUpdateData,
  UsersUpdateResponse,
  UsersPartialUpdateData,
  UsersPartialUpdateResponse,
  UsersDestroyData,
  UsersDestroyResponse,
} from "./types.gen";

export class ChatroomService {
  /**
   * @param data The data for the request.
   * @param data.limit Number of results to return per page.
   * @param data.offset The initial index from which to return the results.
   * @returns PaginatedChatRoomSeralizerList
   * @throws ApiError
   */
  public static chatroomList(
    data: ChatroomListData = {},
  ): CancelablePromise<ChatroomListResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/chatroom/",
      query: {
        limit: data.limit,
        offset: data.offset,
      },
    });
  }

  /**
   * @param data The data for the request.
   * @param data.requestBody
   * @returns ChatRoomSeralizer
   * @throws ApiError
   */
  public static chatroomCreate(
    data: ChatroomCreateData,
  ): CancelablePromise<ChatroomCreateResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/chatroom/",
      body: data.requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param data The data for the request.
   * @param data.id A unique integer value identifying this chat room.
   * @returns ChatRoomSeralizer
   * @throws ApiError
   */
  public static chatroomRetrieve(
    data: ChatroomRetrieveData,
  ): CancelablePromise<ChatroomRetrieveResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/chatroom/{id}/",
      path: {
        id: data.id,
      },
    });
  }

  /**
   * @param data The data for the request.
   * @param data.id A unique integer value identifying this chat room.
   * @param data.requestBody
   * @returns ChatRoomSeralizer
   * @throws ApiError
   */
  public static chatroomUpdate(
    data: ChatroomUpdateData,
  ): CancelablePromise<ChatroomUpdateResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/chatroom/{id}/",
      path: {
        id: data.id,
      },
      body: data.requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param data The data for the request.
   * @param data.id A unique integer value identifying this chat room.
   * @param data.requestBody
   * @returns ChatRoomSeralizer
   * @throws ApiError
   */
  public static chatroomPartialUpdate(
    data: ChatroomPartialUpdateData,
  ): CancelablePromise<ChatroomPartialUpdateResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/chatroom/{id}/",
      path: {
        id: data.id,
      },
      body: data.requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param data The data for the request.
   * @param data.id A unique integer value identifying this chat room.
   * @returns void No response body
   * @throws ApiError
   */
  public static chatroomDestroy(
    data: ChatroomDestroyData,
  ): CancelablePromise<ChatroomDestroyResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/chatroom/{id}/",
      path: {
        id: data.id,
      },
    });
  }
}

export class ChatroomsService {
  /**
   * @param data The data for the request.
   * @param data.requestBody
   * @returns CreateChatRoom
   * @throws ApiError
   */
  public static chatroomsJoinCreate(
    data: ChatroomsJoinCreateData,
  ): CancelablePromise<ChatroomsJoinCreateResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/chatrooms/join/",
      body: data.requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param data The data for the request.
   * @param data.requestBody
   * @returns CreateChatRoom
   * @throws ApiError
   */
  public static chatroomsLeaveCreate(
    data: ChatroomsLeaveCreateData,
  ): CancelablePromise<ChatroomsLeaveCreateResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/chatrooms/leave/",
      body: data.requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @returns TopChatsResponse
   * @throws ApiError
   */
  public static chatroomsTop5Retrieve(): CancelablePromise<ChatroomsTop5RetrieveResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/chatrooms/top5/",
    });
  }
}

export class EventsService {
  /**
   * @param data The data for the request.
   * @param data.requestBody
   * @returns Events
   * @throws ApiError
   */
  public static eventsCreateCreate(
    data: EventsCreateCreateData,
  ): CancelablePromise<EventsCreateCreateResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/events/create/",
      body: data.requestBody,
      mediaType: "application/json",
    });
  }
}

export class RestService {
  /**
   * Check REST API
   * This endpoint checks if the REST API is working.
   * @returns Message
   * @throws ApiError
   */
  public static restRestCheckRetrieve(): CancelablePromise<RestRestCheckRetrieveResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/rest/rest-check/",
    });
  }
}

export class UsersService {
  /**
   * @param data The data for the request.
   * @param data.limit Number of results to return per page.
   * @param data.offset The initial index from which to return the results.
   * @returns PaginatedUserList
   * @throws ApiError
   */
  public static usersList(
    data: UsersListData = {},
  ): CancelablePromise<UsersListResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/users/",
      query: {
        limit: data.limit,
        offset: data.offset,
      },
    });
  }

  /**
   * @param data The data for the request.
   * @param data.requestBody
   * @returns User
   * @throws ApiError
   */
  public static usersCreate(
    data: UsersCreateData,
  ): CancelablePromise<UsersCreateResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/users/",
      body: data.requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param data The data for the request.
   * @param data.id A unique integer value identifying this user.
   * @returns User
   * @throws ApiError
   */
  public static usersRetrieve(
    data: UsersRetrieveData,
  ): CancelablePromise<UsersRetrieveResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/users/{id}/",
      path: {
        id: data.id,
      },
    });
  }

  /**
   * @param data The data for the request.
   * @param data.id A unique integer value identifying this user.
   * @param data.requestBody
   * @returns User
   * @throws ApiError
   */
  public static usersUpdate(
    data: UsersUpdateData,
  ): CancelablePromise<UsersUpdateResponse> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/users/{id}/",
      path: {
        id: data.id,
      },
      body: data.requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param data The data for the request.
   * @param data.id A unique integer value identifying this user.
   * @param data.requestBody
   * @returns User
   * @throws ApiError
   */
  public static usersPartialUpdate(
    data: UsersPartialUpdateData,
  ): CancelablePromise<UsersPartialUpdateResponse> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/users/{id}/",
      path: {
        id: data.id,
      },
      body: data.requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param data The data for the request.
   * @param data.id A unique integer value identifying this user.
   * @returns void No response body
   * @throws ApiError
   */
  public static usersDestroy(
    data: UsersDestroyData,
  ): CancelablePromise<UsersDestroyResponse> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/users/{id}/",
      path: {
        id: data.id,
      },
    });
  }
}
