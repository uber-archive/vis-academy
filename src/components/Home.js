import React from 'react'

import Footer from 'components/Footer'
import Badge from './Badge.js';
import lessons from 'mdRoutes'

function Home() {
  return (
    <div className="Home f fcol fg">
      <div className="title">
        <img src="images/vis-logo.png" alt="vis-logo" />
        <h1>Vis Academy</h1>
        <p>Tutorials and classes prepared by the Uber visualization team</p>
      </div>
      <div className="fg f fac fw lessons">
        {lessons.map((d, i) => (
          <a href={`#${d.path}`} key={i}>
            <div className="lesson-card f fcol fac">
              <img src={d.image} alt={d.name} className="lesson-card__image" />
              <h3 className="lesson-card__name">{d.name}</h3>
              <p className="lesson-card__desc fg">{d.desc}</p>
              <div className="badges">
                {(d.badges || []).map((d, i) => Badge({tag: d, key: i}))}
              </div>
            </div>
          </a>
        ))}
      </div>

      <Footer />

    </div>
  )
}

export default Home
