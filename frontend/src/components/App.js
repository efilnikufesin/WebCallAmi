require("babel-core/register");
require("babel-polyfill");
import React from "react";
import { render } from "react-dom";
import StartPage from "./StartPage";

require("./App.css");

function App() {
	return ( <React.Fragment>
  			<StartPage />
		</React.Fragment>
);
}

const container = document.createElement("div");
document.body.appendChild(container);
render(<App />, container);
