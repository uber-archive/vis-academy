import React from 'react'

import Footer from 'components/Footer'

import lessons from 'mdRoutes'

function Home() {
  return (
    <div className="Home fg">
      <div className="lessons">
        {lessons.map((d, i) => (
          <a href={`#${d.path}`} key={i}>
            <div className="lesson-card f fcol fac">
              <img src={d.image} alt={d.name} className="lesson-card__image" />
              <h3 className="lesson-card__name">{d.name}</h3>
              <p className="lesson-card__desc fg">{d.desc}</p>
              <span className="lesson-card__get-started btn">{'GET STARTED!'}</span>
            </div>
          </a>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default Home
