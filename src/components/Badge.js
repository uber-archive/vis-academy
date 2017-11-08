import React from 'react';

export default function Badge({tag, key}) {
	return (<div className="badge" key={key}>{tag}</div>);
}
