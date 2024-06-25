import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "assets/styles/main.css";

const rootElement = document.querySelector("#root") as HTMLElement;
if (!rootElement) throw new Error("No root element found");

const root = createRoot(rootElement);
root.render(
	<StrictMode>
		<App />
	</StrictMode>
);