// This file is auto-generated by @hey-api/openapi-ts

export type ChatRoomSeralizer = {
  readonly id: number;
  room_name: string;
  readonly created_at: string;
  user_count?: number;
};

export type CreateChatRoom = {
  room_name: string;
};

export type Events = {
  event_name: string;
  expires_at: string;
  readonly chat_room: number;
  readonly is_active: boolean;
};

export type Message = {
  message: string;
  image: string;
};

export type PaginatedChatRoomSeralizerList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Array<ChatRoomSeralizer>;
};

export type PaginatedUserList = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Array<User>;
};

export type PatchedChatRoomSeralizer = {
  readonly id?: number;
  room_name?: string;
  readonly created_at?: string;
  user_count?: number;
};

export type PatchedUser = {
  readonly id?: number;
  email?: string;
  /**
   * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
   */
  is_active?: boolean;
  /**
   * Designates whether the user can log into this admin site.
   */
  is_staff?: boolean;
  /**
   * Designates that this user has all permissions without explicitly assigning them.
   */
  is_superuser?: boolean;
  readonly created?: string;
  readonly modified?: string;
  last_login?: string | null;
};

export type TopChatsResponse = {
  top_chats: Array<ChatRoomSeralizer>;
};

export type User = {
  readonly id: number;
  email: string;
  /**
   * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
   */
  is_active?: boolean;
  /**
   * Designates whether the user can log into this admin site.
   */
  is_staff?: boolean;
  /**
   * Designates that this user has all permissions without explicitly assigning them.
   */
  is_superuser?: boolean;
  readonly created: string;
  readonly modified: string;
  last_login?: string | null;
};

export type ChatroomListData = {
  /**
   * Number of results to return per page.
   */
  limit?: number;
  /**
   * The initial index from which to return the results.
   */
  offset?: number;
};

export type ChatroomListResponse = PaginatedChatRoomSeralizerList;

export type ChatroomCreateData = {
  requestBody: ChatRoomSeralizer;
};

export type ChatroomCreateResponse = ChatRoomSeralizer;

export type ChatroomRetrieveData = {
  /**
   * A unique integer value identifying this chat room.
   */
  id: number;
};

export type ChatroomRetrieveResponse = ChatRoomSeralizer;

export type ChatroomUpdateData = {
  /**
   * A unique integer value identifying this chat room.
   */
  id: number;
  requestBody: ChatRoomSeralizer;
};

export type ChatroomUpdateResponse = ChatRoomSeralizer;

export type ChatroomPartialUpdateData = {
  /**
   * A unique integer value identifying this chat room.
   */
  id: number;
  requestBody?: PatchedChatRoomSeralizer;
};

export type ChatroomPartialUpdateResponse = ChatRoomSeralizer;

export type ChatroomDestroyData = {
  /**
   * A unique integer value identifying this chat room.
   */
  id: number;
};

export type ChatroomDestroyResponse = void;

export type ChatroomsJoinCreateData = {
  requestBody: CreateChatRoom;
};

export type ChatroomsJoinCreateResponse = CreateChatRoom;

export type ChatroomsLeaveCreateData = {
  requestBody: CreateChatRoom;
};

export type ChatroomsLeaveCreateResponse = CreateChatRoom;

export type ChatroomsTop5RetrieveResponse = TopChatsResponse;

export type EventsCreateCreateData = {
  requestBody: Events;
};

export type EventsCreateCreateResponse = Events;

export type RestRestCheckRetrieveResponse = Message;

export type UsersListData = {
  /**
   * Number of results to return per page.
   */
  limit?: number;
  /**
   * The initial index from which to return the results.
   */
  offset?: number;
};

export type UsersListResponse = PaginatedUserList;

export type UsersCreateData = {
  requestBody: User;
};

export type UsersCreateResponse = User;

export type UsersRetrieveData = {
  /**
   * A unique integer value identifying this user.
   */
  id: number;
};

export type UsersRetrieveResponse = User;

export type UsersUpdateData = {
  /**
   * A unique integer value identifying this user.
   */
  id: number;
  requestBody: User;
};

export type UsersUpdateResponse = User;

export type UsersPartialUpdateData = {
  /**
   * A unique integer value identifying this user.
   */
  id: number;
  requestBody?: PatchedUser;
};

export type UsersPartialUpdateResponse = User;

export type UsersDestroyData = {
  /**
   * A unique integer value identifying this user.
   */
  id: number;
};

export type UsersDestroyResponse = void;

export type $OpenApiTs = {
  "/api/chatroom/": {
    get: {
      req: ChatroomListData;
      res: {
        200: PaginatedChatRoomSeralizerList;
      };
    };
    post: {
      req: ChatroomCreateData;
      res: {
        201: ChatRoomSeralizer;
      };
    };
  };
  "/api/chatroom/{id}/": {
    get: {
      req: ChatroomRetrieveData;
      res: {
        200: ChatRoomSeralizer;
      };
    };
    put: {
      req: ChatroomUpdateData;
      res: {
        200: ChatRoomSeralizer;
      };
    };
    patch: {
      req: ChatroomPartialUpdateData;
      res: {
        200: ChatRoomSeralizer;
      };
    };
    delete: {
      req: ChatroomDestroyData;
      res: {
        /**
         * No response body
         */
        204: void;
      };
    };
  };
  "/api/chatrooms/join/": {
    post: {
      req: ChatroomsJoinCreateData;
      res: {
        200: CreateChatRoom;
      };
    };
  };
  "/api/chatrooms/leave/": {
    post: {
      req: ChatroomsLeaveCreateData;
      res: {
        200: CreateChatRoom;
      };
    };
  };
  "/api/chatrooms/top5/": {
    get: {
      res: {
        200: TopChatsResponse;
      };
    };
  };
  "/api/events/create/": {
    post: {
      req: EventsCreateCreateData;
      res: {
        200: Events;
      };
    };
  };
  "/api/rest/rest-check/": {
    get: {
      res: {
        200: Message;
      };
    };
  };
  "/api/users/": {
    get: {
      req: UsersListData;
      res: {
        200: PaginatedUserList;
      };
    };
    post: {
      req: UsersCreateData;
      res: {
        201: User;
      };
    };
  };
  "/api/users/{id}/": {
    get: {
      req: UsersRetrieveData;
      res: {
        200: User;
      };
    };
    put: {
      req: UsersUpdateData;
      res: {
        200: User;
      };
    };
    patch: {
      req: UsersPartialUpdateData;
      res: {
        200: User;
      };
    };
    delete: {
      req: UsersDestroyData;
      res: {
        /**
         * No response body
         */
        204: void;
      };
    };
  };
};
