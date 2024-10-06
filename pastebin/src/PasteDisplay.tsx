import { useEffect, useState } from "react";
import './App.css';
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
console.log("process",process.env.REACT_APP_BASE_URL)
console.log("Server IP",BASE_URL)

export function PasteDisplay() {

    const [paste, setPaste] = useState<string>("")
    const [saved, setSaved] = useState<boolean>(false)  
    const [shareLink, setShareLink] = useState<string>("")
    const [isEditable, setIsEditable] = useState<boolean>(true)

    useEffect(() => {
        const pasteId = window.location.pathname.split('/')[2]; 
        if (pasteId) {
            fetchPaste(pasteId);
        }
    }, []);

    async function fetchPaste(pasteId: string) {
        try {
            const response = await axios.get(`${BASE_URL}/pastes/${pasteId}`);
            if (response.status === 200) {
                setPaste(response.data.content);
            }
        } catch (error) {
            console.error("Failed to fetch paste:", error);
        } finally {
            setIsEditable(false);
        }
    }

    async function save() {
        console.log(paste)

        try {
            const response = await axios.post(`${BASE_URL}/pastes`, {
                content: paste
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(response, "response");
            if (response.status === 201) {
                setSaved(true);
                setShareLink(`${window.location.origin}/pastes/${response.data.id}`);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    function handleEdit() {
        setIsEditable(true);
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
        <div className="paste-container">
            <h1>Paste here</h1>
            <textarea
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                readOnly={!isEditable}
                placeholder="Enter your paste here"
            />
            <button onClick={() => setPaste("")}>Clear</button>
            <button onClick={save} >Save</button>

            {!isEditable && <button onClick={handleEdit}>Edit</button>}

            {saved && (
                <button onClick={copyShareLink}>Copy Share Link</button>
            )}
        </div>

    );
}