import { useState } from "react";

type Props = {
  onSubmit: (data: any) => void;
};

export default function InputForm({ onSubmit }: Props) {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("informative");
  const [voice, setVoice] = useState("female");
  const [duration, setDuration] = useState(30);

  function submit() {
    onSubmit({
      topic,
      description,
      duration,
      tone,
      voice,
      language: "English",
    });
  }

  return (
    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create AI Short</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-slate-300">Video Topic</label>
          <input
            className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Tone</label>
          <select
            className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="informative">Informative</option>
            <option value="promotional">Promotional</option>
            <option value="storytelling">Storytelling</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-slate-300">
            Script Idea / Description
          </label>
          <textarea
            className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-slate-700 h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={submit}
        className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-lg"
      >
        ✨ Generate AI Short
      </button>
    </div>
  );
}
