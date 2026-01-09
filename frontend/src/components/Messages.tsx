import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  MessageCircle,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import * as messageServices from "../services/messageServices";
import defaultAvatar from "../assets/images/defaultAvatar.png";

type ApiUser = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

type ApiParticipant = {
  id: string;
  userId: string;
  isArchived?: boolean;
  user: ApiUser;
};

type ApiMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  isEdited: boolean;
  sender?: ApiUser;
  editedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
};

type ApiConversation = {
  id: string;
  participants: ApiParticipant[];
  messages?: ApiMessage[];
  updatedAt?: string;
};

interface ConversationVM {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

export function Messages() {
  const { currentUser } = useAuth();
  const {
    socket,
    connected,
    refreshUnreadCounts: refreshGlobalUnreadCounts,
  } = useSocket();

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversationsRaw, setConversationsRaw] = useState<ApiConversation[]>(
    []
  );
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [unreadByConversation, setUnreadByConversation] = useState<
    Record<string, number>
  >({});

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null
  );

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollMessagesToBottom = (behavior: ScrollBehavior = "auto") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
      const el = messagesContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  const refreshUnreadCounts = () => {
    if (!socket) return;
    socket.emit("getUnreadCount", null, (resp: any) => {
      if (!resp?.success) return;
      const next: Record<string, number> = {};
      for (const row of resp.unreadCounts ?? [])
        next[row.conversationId] = row.unread ?? 0;
      setUnreadByConversation(next);
    });
  };

  const refreshOnlineUsers = () => {
    if (!socket) return;
    socket.emit("getOnlineUsers", (userIds: string[]) => {
      if (!Array.isArray(userIds)) return;
      setOnlineUserIds(new Set(userIds));
    });
  };

  useEffect(() => {
    const stateConversation = (location.state as any)?.conversation as
      | ApiConversation
      | undefined;
    const stateConversationId = (location.state as any)?.conversationId as
      | string
      | undefined;
    const qsConversationId = searchParams.get("conversationId") ?? undefined;

    const targetId =
      stateConversation?.id ?? stateConversationId ?? qsConversationId;

    if (!targetId) return;

    setSelectedConversationId(targetId);

    if (stateConversation) {
      setConversationsRaw((prev) => {
        const exists = prev.some((c) => c.id === stateConversation.id);
        if (exists) return prev;
        return [stateConversation, ...prev];
      });
    }
  }, [location.state, searchParams]);

  const selectedConversation = useMemo(() => {
    return (
      conversationsRaw.find((c) => c.id === selectedConversationId) ?? null
    );
  }, [conversationsRaw, selectedConversationId]);

  const getOtherParticipant = (conv: ApiConversation): ApiUser | null => {
    if (!currentUser) return null;
    const other = conv.participants.find((p) => p.userId !== currentUser.id);
    return other?.user ?? null;
  };
  const conversationsVM: ConversationVM[] = useMemo(() => {
    return conversationsRaw
      .map((conv) => {
        const other = getOtherParticipant(conv);
        const last = conv.messages?.[0];
        const unreadCount = unreadByConversation[conv.id] ?? 0;
        return {
          id: conv.id,
          participantId: other?.id ?? "unknown",
          participantName: other?.name ?? "Unknown",
          participantAvatar: other?.avatarUrl ?? undefined,
          lastMessage: last
            ? last.isDeleted
              ? "Message deleted"
              : last.content ?? ""
            : "",
          lastMessageTime: last?.createdAt
            ? new Date(last.createdAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "",
          unreadCount,
          online: other?.id ? onlineUserIds.has(other.id) : false,
        };
      })
      .filter((c) =>
        c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [
    conversationsRaw,
    onlineUserIds,
    searchQuery,
    unreadByConversation,
    currentUser,
  ]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await messageServices.getConversations();
        const convs: ApiConversation[] = data.conversations ?? data;
        setConversationsRaw(convs);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }
    };
    if (currentUser) run();
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    const onOnlineUsers = (userIds: string[]) => {
      setOnlineUserIds(new Set(userIds));
    };

    const onNewMessage = (msg: ApiMessage) => {
      if (msg.conversationId === selectedConversationId) {
        setMessages((prev) => [...prev, msg]);
        scrollMessagesToBottom("smooth");

        if (currentUser?.id && msg.senderId !== currentUser.id) {
          socket.emit(
            "markAsRead",
            { conversationId: selectedConversationId },
            (resp: any) => {
              if (!resp?.success) return;
              refreshUnreadCounts();
              refreshGlobalUnreadCounts();
            }
          );
        }
      }

      setConversationsRaw((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId ? { ...c, messages: [msg] } : c
        )
      );

      refreshUnreadCounts();
      refreshGlobalUnreadCounts();
    };
    const onTyping = (data: {
      userId: string;
      isTyping: boolean;
      conversationId?: string;
    }) => {
      if (!data.userId) return;
      setTypingUsers((prev) => ({ ...prev, [data.userId]: data.isTyping }));
    };

    const onMessageEdited = (updated: ApiMessage) => {
      if (!updated?.id) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
      );
      setConversationsRaw((prev) =>
        prev.map((c) =>
          c.id === updated.conversationId ? { ...c, messages: [updated] } : c
        )
      );
    };

    const onMessageDeleted = (deleted: ApiMessage) => {
      if (!deleted?.id) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === deleted.id ? { ...m, ...deleted } : m))
      );
      setConversationsRaw((prev) =>
        prev.map((c) =>
          c.id === deleted.conversationId ? { ...c, messages: [deleted] } : c
        )
      );
    };

    socket.on("onlineUsers", onOnlineUsers);
    socket.on("newMessage", onNewMessage);
    socket.on("typing", onTyping);
    socket.on("messageEdited", onMessageEdited);
    socket.on("messageDeleted", onMessageDeleted);

    return () => {
      socket.off("onlineUsers", onOnlineUsers);
      socket.off("newMessage", onNewMessage);
      socket.off("typing", onTyping);
      socket.off("messageEdited", onMessageEdited);
      socket.off("messageDeleted", onMessageDeleted);
    };
  }, [socket, selectedConversationId, currentUser?.id]);

  useEffect(() => {
    if (!selectedConversationId) return;
    scrollMessagesToBottom("auto");
  }, [messages.length, selectedConversationId]);

  useEffect(() => {
    if (!socket || !connected) return;
    refreshOnlineUsers();
    refreshUnreadCounts();
  }, [socket, connected, conversationsRaw.length]);

  useEffect(() => {
    if (!selectedConversationId) return;
    const run = async () => {
      try {
        const data = await messageServices.getConversationMessages(
          selectedConversationId
        );
        const msgs: ApiMessage[] = data.messages ?? data;
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };
    run();
  }, [selectedConversationId]);

  const lastJoinedConversationId = useRef<string | null>(null);
  useEffect(() => {
    if (!socket || !selectedConversationId) return;

    if (
      lastJoinedConversationId.current &&
      lastJoinedConversationId.current !== selectedConversationId
    ) {
      socket.emit("leaveConversation", lastJoinedConversationId.current);
    }
    socket.emit("joinConversation", selectedConversationId);
    lastJoinedConversationId.current = selectedConversationId;

    socket.emit(
      "markAsRead",
      { conversationId: selectedConversationId },
      (resp: any) => {
        if (!resp?.success) return;

        refreshUnreadCounts();
        refreshGlobalUnreadCounts();
      }
    );
    return () => {
      socket.emit("leaveConversation", selectedConversationId);
    };
  }, [socket, selectedConversationId]);

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!socket || !selectedConversationId) return;

    socket.emit("typing", {
      conversationId: selectedConversationId,
      isTyping: value.length > 0,
    });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: selectedConversationId,
        isTyping: false,
      });
    }, 800);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversationId) return;

    const content = newMessage.trim();
    if (!content) return;

    setNewMessage("");

    if (socket) {
      socket.emit(
        "sendMessage",
        { conversationId: selectedConversationId, content },
        (resp: any) => {
          if (!resp?.success) {
            console.error("sendMessage failed", resp?.error);
            return;
          }

          const msg: ApiMessage | undefined = resp.message;
          if (!msg) return;

          if (msg.conversationId === selectedConversationId) {
            setMessages((prev) => [...prev, msg]);
            scrollMessagesToBottom("smooth");
          }

          setConversationsRaw((prev) =>
            prev.map((c) =>
              c.id === msg.conversationId ? { ...c, messages: [msg] } : c
            )
          );
        }
      );
      return;
    }

    try {
      await messageServices.sendMessage(selectedConversationId, content);
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const startEditing = (m: ApiMessage) => {
    if (!currentUser) return;
    if (m.senderId !== currentUser.id) return;
    if (m.isDeleted) return;
    setEditingMessageId(m.id);
    setEditingValue(m.content ?? "");
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingValue("");
    setSavingEdit(false);
  };

  const saveEdit = async (m: ApiMessage) => {
    if (!currentUser) return;
    if (m.senderId !== currentUser.id) return;
    if (!selectedConversationId) return;

    const trimmed = editingValue.trim();
    if (!trimmed) return;

    setSavingEdit(true);
    try {
      if (socket) {
        socket.emit(
          "editMessage",
          { messageId: m.id, newContent: trimmed },
          (resp: any) => {
            setSavingEdit(false);
            if (!resp?.success) {
              console.error("editMessage failed", resp?.error);
              return;
            }
            const updated: ApiMessage | undefined = resp.message;
            if (updated?.id) {
              setMessages((prev) =>
                prev.map((x) =>
                  x.id === updated.id ? { ...x, ...updated } : x
                )
              );
              setConversationsRaw((prev) =>
                prev.map((c) =>
                  c.id === updated.conversationId
                    ? { ...c, messages: [updated] }
                    : c
                )
              );
            }
            cancelEditing();
          }
        );
        return;
      }

      const resp = await messageServices.editMessage(
        selectedConversationId,
        m.id,
        trimmed
      );
      const updated: ApiMessage | undefined = resp?.message ?? resp;
      if (updated?.id) {
        setMessages((prev) =>
          prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x))
        );
        setConversationsRaw((prev) =>
          prev.map((c) =>
            c.id === updated.conversationId ? { ...c, messages: [updated] } : c
          )
        );
      }
      cancelEditing();
    } catch (e) {
      setSavingEdit(false);
      console.error("Failed to edit message", e);
    }
  };

  const deleteMsg = async (m: ApiMessage) => {
    if (!currentUser) return;
    if (m.senderId !== currentUser.id) return;
    if (!selectedConversationId) return;
    if (m.isDeleted) return;

    setDeletingMessageId(m.id);
    try {
      if (socket) {
        socket.emit("deleteMessage", { messageId: m.id }, (resp: any) => {
          setDeletingMessageId(null);
          if (!resp?.success) {
            console.error("deleteMessage failed", resp?.error);
            return;
          }
          const deleted: ApiMessage | undefined = resp.message;
          if (deleted?.id) {
            setMessages((prev) =>
              prev.map((x) => (x.id === deleted.id ? { ...x, ...deleted } : x))
            );
            setConversationsRaw((prev) =>
              prev.map((c) =>
                c.id === deleted.conversationId
                  ? { ...c, messages: [deleted] }
                  : c
              )
            );
          }
        });
        return;
      }

      const resp = await messageServices.deleteMessage(
        selectedConversationId,
        m.id
      );
      const deleted: ApiMessage | undefined = resp?.message ?? resp;
      if (deleted?.id) {
        setMessages((prev) =>
          prev.map((x) => (x.id === deleted.id ? { ...x, ...deleted } : x))
        );
        setConversationsRaw((prev) =>
          prev.map((c) =>
            c.id === deleted.conversationId ? { ...c, messages: [deleted] } : c
          )
        );
      }
    } catch (e) {
      console.error("Failed to delete message", e);
    } finally {
      setDeletingMessageId(null);
    }
  };

  const selectedOther = selectedConversation
    ? getOtherParticipant(selectedConversation)
    : null;
  const selectedOtherTyping = selectedOther?.id
    ? !!typingUsers[selectedOther.id]
    : false;

  return (
    <div className="h-full flex bg-background">
      <div className="w-20 sm:w-72 border-r border-gray1 flex flex-col bg-gray2">
        <div className="p-3 sm:p-4 border-b border-gray1">
          <div className="flex items-center sm:justify-between justify-center mb-0 sm:mb-4">
            <div className="flex items-center gap-0 sm:gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sunglow-500 to-sunglow-600 flex items-center justify-center shadow-lg shadow-sunglow-500/20">
                <MessageCircle className="w-5 h-5 text-sunglow-950" />
              </div>
              <h2 className="hidden sm:block text-xl font-semibold text-sunglow-50">
                {currentUser?.name ?? "Messages"}
              </h2>
            </div>
          </div>

          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sunglow-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray1 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus:border-sunglow-500/50 focus:ring-sunglow-500/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {conversationsVM.length === 0 ? (
            <div className="p-6 text-center text-sunglow-200/60">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversationsVM.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  setSelectedConversationId(conversation.id);
                  setSearchParams({ conversationId: conversation.id });
                }}
                className={`w-full p-2 sm:p-4 flex items-start sm:items-start gap-0 sm:gap-3 border-b border-gray1 transition-all duration-200 ${
                  selectedConversationId === conversation.id
                    ? "bg-sunglow-500/10 border-l-2 border-l-sunglow-500"
                    : "hover:bg-gray1/50"
                }`}
              >
                <div className="relative flex-shrink-0 w-full sm:w-auto flex justify-center sm:block">
                  <Avatar className="w-12 h-12 ring-2 ring-gray1 ">
                    <AvatarImage
                      className="object-cover object-center"
                      src={conversation.participantAvatar || defaultAvatar}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultAvatar;
                      }}
                    />
                  </Avatar>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray2 rounded-full" />
                  )}
                  {conversation.unreadCount > 0 && (
                    <Badge className="sm:hidden absolute -top-1 -right-1 bg-sunglow-500 text-sunglow-950 text-[10px] px-1.5 py-0">
                      {conversation.unreadCount > 99
                        ? "99+"
                        : conversation.unreadCount}
                    </Badge>
                  )}
                </div>

                <div className="hidden sm:block flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate text-sunglow-50">
                      {conversation.participantName}
                    </span>
                    <span className="text-xs text-sunglow-200/50 ml-2">
                      {conversation.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-sunglow-200/60 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge className="ml-2 bg-sunglow-500 text-sunglow-950 text-xs px-2 py-0.5">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedConversationId && selectedOther ? (
        <div className="flex-1 flex flex-col bg-background">
          <div className="p-4 border-b border-gray1 bg-gray2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-11 h-11 ring-2 ring-sunglow-500/30">
                  <AvatarImage
                    className="object-cover object-center"
                    src={selectedOther.avatarUrl || defaultAvatar}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-sunglow-500 to-sunglow-600 text-sunglow-950 font-semibold">
                    {selectedOther.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {onlineUserIds.has(selectedOther.id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray2 rounded-full" />
                )}
              </div>
              <div>
                <div className="font-medium text-sunglow-50">
                  {selectedOther.name}
                </div>
                <div className="text-sm text-sunglow-200/60">
                  {onlineUserIds.has(selectedOther.id) ? (
                    <span className="text-green-400">Online</span>
                  ) : (
                    "Offline"
                  )}
                  {selectedOtherTyping && (
                    <span className="text-sunglow-400 ml-1">• typing...</span>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-sunglow-200/60 hover:text-sunglow-50 hover:bg-gray1"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-auto p-6 space-y-4 bg-background"
          >
            {messages.map((m) => {
              const isCurrentUser = currentUser?.id === m.senderId;
              const isEditing = editingMessageId === m.id;
              const canModify = isCurrentUser && !m.isDeleted;
              return (
                <div
                  key={m.id}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[70%]">
                    <div
                      className={`rounded-2xl px-4 py-1.5 ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-sunglow-500 to-sunglow-400 text-sunglow-950"
                          : "bg-gray2 border border-gray1 text-sunglow-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {m.isDeleted ? (
                            <p className="italic text-sm opacity-70">
                              Message deleted
                            </p>
                          ) : isEditing ? (
                            <div className="space-y-2">
                              <Input
                                value={editingValue}
                                onChange={(e) =>
                                  setEditingValue(e.target.value)
                                }
                                className="bg-gray1 border-gray1 text-sunglow-50"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={cancelEditing}
                                  disabled={savingEdit}
                                  className="border-gray1 text-sunglow-200 hover:bg-gray1 bg-transparent"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => saveEdit(m)}
                                  disabled={savingEdit || !editingValue.trim()}
                                  className="bg-sunglow-500 text-sunglow-950 hover:bg-sunglow-400"
                                >
                                  {savingEdit ? "Saving..." : "Save"}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap break-words">
                              {m.content}
                            </p>
                          )}
                        </div>

                        {canModify && !isEditing && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={`h-6 w-6 ${
                                  isCurrentUser
                                    ? "text-sunglow-800 hover:text-sunglow-950 hover:bg-sunglow-400/30"
                                    : "text-sunglow-200/60 hover:text-sunglow-50 hover:bg-gray1"
                                }`}
                                disabled={deletingMessageId === m.id}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-gray2 border-gray1"
                            >
                              <DropdownMenuItem
                                onClick={() => startEditing(m)}
                                className="text-sunglow-50 focus:bg-gray1 focus:text-sunglow-50"
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteMsg(m)}
                                disabled={deletingMessageId === m.id}
                                className="text-red-400 focus:bg-gray1 focus:text-red-400"
                              >
                                {deletingMessageId === m.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      <div
                        className={`text-xs mt-1 flex justify-end ${
                          isCurrentUser
                            ? "text-sunglow-800"
                            : "text-sunglow-200/50"
                        }`}
                      >
                        {new Date(
                          m.isDeleted && m.deletedAt
                            ? m.deletedAt
                            : !m.isDeleted && m.isEdited && m.editedAt
                            ? m.editedAt
                            : m.createdAt
                        ).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                        {m.isDeleted && m.deletedAt ? " • deleted" : ""}
                        {!m.isDeleted && m.isEdited && m.editedAt
                          ? " • edited"
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray1 bg-gray2">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-3"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-sunglow-200/60 hover:text-sunglow-50 hover:bg-gray1"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                className="flex-1 bg-gray1 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus:border-sunglow-500/50 focus:ring-sunglow-500/20"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-gradient-to-r from-sunglow-500 to-sunglow-400 text-sunglow-950 hover:from-sunglow-400 hover:to-sunglow-300 shadow-lg shadow-sunglow-500/20"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray2 border border-gray1 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-sunglow-500/50" />
            </div>
            <p className="text-sunglow-200/60 text-lg">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
