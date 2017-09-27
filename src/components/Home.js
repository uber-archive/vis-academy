import React from 'react';

import lessons from '../mdRoutes';
import Footer from 'components/Footer';

function Home() {
  return (<div id="Home">
    <div className="lessons">
      {lessons.map((d, i) => (<a href={`#${d.path}`} key={i}>
        <div className="lesson-card">
          <img src={d.image} alt={d.name} className="lesson-card__image" />
          <h3 className="lesson-card__name">{d.name}</h3>
          <p className="lesson-card__desc">{d.desc}</p>
          <div className="lesson-card__get-started btn" href={`#${d.path}`}>
            Get started!
          </div>
        </div>
      </a>))}
    </div>
    <Footer />
  </div>);
}

export default Home;
