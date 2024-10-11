import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


export default function FileUploadPopUp(){
	return (<Popup trigger={<button>Open Popup</button>} position="right center">
		<div>Popup content here!</div>
		</Popup>
	       );
};
