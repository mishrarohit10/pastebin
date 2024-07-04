import { Editor } from "./Editor";
import { Footer } from "./Footer";
import { NavBar } from "./NavBar";
import { PasteDisplay } from "./PasteDisplay";


function App() {
  return (
    <>
        <NavBar />
        <PasteDisplay />
        <Editor />
        <Footer />
    </>
  );
}

export default App;