export default function VideoResult({ data }: any) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Generated Script</h2>
      <p>{data.script}</p>

      <h2>Scene-wise Narration</h2>
      <ul>
        {data.scenes.map((scene: any) => (
          <li key={scene.scene_id}>
            <strong>Scene {scene.scene_id}:</strong> {scene.text}
          </li>
        ))}
      </ul>

      <h2>Final Video</h2>
      <video width="400" controls>
        <source src={`http://localhost:8000/${data.video}`} />
      </video>

      <h2>Captions</h2>
      <ul>
        {data.captions.map((c: any, i: number) => (
          <li key={i}>{c.text}</li>
        ))}
      </ul>
    </div>
  );
}
