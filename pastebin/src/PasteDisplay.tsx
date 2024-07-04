import { useState } from "react";
import axios from "axios";


export function PasteDisplay() {

    const [paste, setPaste] = useState<string>("")
    const [saved, setSaved] = useState<boolean>(false)
    const [shareLink, setShareLink] = useState<string>("")

    async function save() {
        console.log(paste)

        try {
            const response = await axios.post("http://localhost:3000/pastes", {
                content: paste
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(response, "response");
            if (response.status === 201) {
                setSaved(true);
                setShareLink(`http://localhost:3000/pastes/${response.data.id}`);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async function copyShareLink() {
        if (shareLink) {
            try {
                await navigator.clipboard.writeText(shareLink);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy: ", err);
            }
        }
    }

    return (
        <div>
            <h1>Paste Display</h1>
            <textarea
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                placeholder="Enter your paste here"
            />
            <button onClick={() => setPaste("")}>Clear</button>
            <button onClick={save} >Save</button>

            {saved && (
                <button onClick={copyShareLink}>Copy Share Link</button>
            )}
        </div>

    );
}