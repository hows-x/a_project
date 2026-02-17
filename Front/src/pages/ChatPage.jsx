import { useEffect } from "react";
import ChatInterface from "../components/chat/ChatInterface";
import TimeContext from "../contexts/TimeContext";

export default function ChatPage() {
  return (
    <>
      <div>
        <h1 className="text-black text-2xl font-bold mb-4">
          {<TimeContext />}
        </h1>
        <ChatInterface />
      </div>
    </>
  );
}

