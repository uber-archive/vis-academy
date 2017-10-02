import React from 'react';

export default function Bagdge({tag, key}) {
	return (<div className="badge" key={key}>{tag}</div>);
}
