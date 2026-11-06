import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Composer from "./components/Composer";
import Message from "./components/Message";
import Thinking from "./components/Thinking";
import Empty from "./components/Empty";
import AdminMenu from "./components/AdminMenu";
import Toast, { type ToastData } from "./components/Toast";
import { getHealth, ingestFile, sendChat, type HealthResponse } from "./lib/api";
import {
  emptyChat,
  loadChats,
  newId,
  saveChats,
  titleFrom,
  type Chat,
  type Message as ChatMessage,
} from "./lib/chats";

const ADMIN_KEY_STORAGE = "enterprise-rag.adminKey";

export default function App() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const stored = loadChats();
    return stored.length > 0 ? stored : [emptyChat()];
  });
  const [activeId, setActiveId] = useState(() => chats[0].id);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [online, setOnline] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [adminKey, setAdminKey] = useState(
    () => localStorage.getItem(ADMIN_KEY_STORAGE) ?? "",
  );

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeId) ?? chats[0],
    [chats, activeId],
  );

  useEffect(() => saveChats(chats), [chats]);

  useEffect(() => {
    localStorage.setItem(ADMIN_KEY_STORAGE, adminKey);
  }, [adminKey]);

  useEffect(() => {
    let cancelled = false;
    async function ping() {
      try {
        const data = await getHealth();
        if (!cancelled) {
          setHealth(data);
          setOnline(true);
        }
      } catch {
        if (!cancelled) setOnline(false);
      }
    }
    ping();
    const timer = setInterval(ping, 30000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages.length, busy]);

  const toast = useCallback((kind: ToastData["kind"], text: string) => {
    setToasts((prev) => [...prev, { id: newId(), kind, text }]);
  }, []);

  const patchChat = useCallback((id: string, update: (chat: Chat) => Chat) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? update(chat) : chat)),
    );
  }, []);

  const appendMessage = useCallback(
    (id: string, message: ChatMessage) => {
      patchChat(id, (chat) => ({
        ...chat,
        messages: [...chat.messages, message],
        updatedAt: Date.now(),
      }));
    },
    [patchChat],
  );

  const handleSend = useCallback(
    async (question: string) => {
      const chatId = activeChat.id;
      const controller = new AbortController();
      abortRef.current = controller;

      appendMessage(chatId, {
        id: newId(),
        role: "user",
        content: question,
        at: Date.now(),
      });
      patchChat(chatId, (chat) => ({
        ...chat,
        title: chat.messages.length === 0 ? titleFrom(question) : chat.title,
      }));
      setBusy(true);

      try {
        const res = await sendChat(question, controller.signal);
        appendMessage(chatId, {
          id: newId(),
          role: "assistant",
          content: res.answer,
          at: Date.now(),
          sourceUsed: res.source_used,
          citations: res.citations,
          trace: res.trace,
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          appendMessage(chatId, {
            id: newId(),
            role: "assistant",
            content: "_Stopped._",
            at: Date.now(),
          });
        } else {
          appendMessage(chatId, {
            id: newId(),
            role: "assistant",
            content: `**Request failed.** ${(err as Error).message}`,
            at: Date.now(),
            error: true,
          });
        }
      } finally {
        abortRef.current = null;
        setBusy(false);
      }
    },
    [activeChat, appendMessage, patchChat],
  );

  const handleAttach = useCallback(
    async (file: File) => {
      if (!adminKey) {
        toast(
          "error",
          "Add your admin key first - open the Admin menu at the bottom left.",
        );
        return;
      }
      toast("success", `Ingesting ${file.name}...`);
      try {
        const res = await ingestFile(file, adminKey);
        toast(
          "success",
          `${res.filename} added to the knowledge base - ${res.chunks} chunks from ${res.documents} document(s).`,
        );
      } catch (err) {
        toast("error", `Upload failed. ${(err as Error).message}`);
      }
    },
    [adminKey, toast],
  );

  function handleNewChat() {
    const chat = emptyChat();
    setChats((prev) => [chat, ...prev]);
    setActiveId(chat.id);
  }

  function handleDelete(id: string) {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      const list = next.length > 0 ? next : [emptyChat()];
      if (id === activeId) setActiveId(list[0].id);
      return list;
    });
  }

  return (
    <div className="flex h-full">
      <Sidebar
        chats={chats}
        activeId={activeChat.id}
        onNew={handleNewChat}
        onSelect={setActiveId}
        onDelete={handleDelete}
        footer={
          <AdminMenu
            health={health}
            online={online}
            adminKey={adminKey}
            onAdminKeyChange={setAdminKey}
          />
        }
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-line px-8 py-5">
          <h1 className="text-lg font-semibold">Enterprise RAG Assistant</h1>
          <p className="text-sm text-muted">
            Ask questions over your company&apos;s knowledge base.
          </p>
        </header>

        {!online && (
          <div
            role="alert"
            className="border-b border-amber-500/30 bg-amber-500/10 px-8 py-2.5 text-xs text-amber-200"
          >
            Backend not reachable at <code>/api</code>. Start it with{" "}
            <code>uvicorn app.main:app --reload</code>.
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {activeChat.messages.length === 0 ? (
            <Empty onPick={handleSend} />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-6 py-7">
              {activeChat.messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              {busy && <Thinking />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <Composer
          busy={busy}
          onSend={handleSend}
          onStop={() => abortRef.current?.abort()}
          onAttach={handleAttach}
        />
      </main>

      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast
              toast={t}
              onDismiss={() =>
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
