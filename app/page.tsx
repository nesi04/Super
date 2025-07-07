'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recog = new (window as any).webkitSpeechRecognition();
      recog.lang = "en-US";
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      setRecognition(recog);
    }
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes("Daniel") || v.lang === "en-US") || null;

    speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setChat((prev) => [...prev, `🧑 You: ${input}`]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const supermanReply = `🦸 Superman: ${data.reply}`;
    setChat((prev) => [...prev, supermanReply]);
    setInput('');
    setLoading(false);
    speak(data.reply); // 👈 Speak the reply aloud
  };

  const handleListen = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    setListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      setListening(false);
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setListening(false);
    };
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <div className="flex gap-4 items-center justify-center ">
      <Image src="/super.png" alt="Super icon" width={100} height={20} />
      <h1 className="text-3xl font-bold mb-4 text-white"> Super</h1>
      </div>
      <div className="chat-area mb-4 text-left bg-white p-20 rounded-lg">
        {chat.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        {loading && <p><i>Superman is typing...</i></p>}
      </div>

      <div className="flex items-center gap-2 justify-center">
        <input
          className="border px-3 py-2 rounded w-64 bg-yellow-50"
          value={input}
          placeholder="Ask Superman"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={sendMessage}>
          Send
        </button>
        <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={handleListen}>
          🎤 {listening ? "Listening..." : "Speak"}
        </button>
      </div>
    </main>
  );
}
