export async function generateVideo(data, onProgress) {
    try {
        const res = await fetch("http://localhost:8000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Handle Server-Sent Events for progress
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let result = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Process complete events
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || ''; // Keep incomplete data in buffer

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.done) {
                            result = data;
                        } else if (onProgress) {
                            onProgress(data);
                        }
                    } catch (e) {
                        console.error('Error parsing SSE data:', e);
                    }
                }
            }
        }

        return result;
    } catch (error) {
        console.error("Error generating video:", error);
        throw error;
    }
}