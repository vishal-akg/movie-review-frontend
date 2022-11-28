import { useContext, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from '../components/admin'
import Actors from '../components/admin/actors'
import Dashboard from '../components/admin/dashboard'
import Movies from '../components/admin/movies'
import Home from '../components/user/home/home'
import MoviePage from './movie'
import { FeedbackContext, UserContext } from '../contexts'
import ReviewPage from './review'
import ActorPage from './actor'

export default function Index() {
  const { user, dispatchUser } = useContext(UserContext)
  const { feedback, dispatchFeedback } = useContext(FeedbackContext)
  const [editingActor, setEditingActor] = useState(null)
  const [editingMovie, setEditingMovie] = useState(null)

  return user.roles?.includes('admin') ? (
    <Admin
      user={user}
      dispatchUser={dispatchUser}
      setEditingActor={setEditingActor}
      feedback={feedback}
      dispatchFeedback={dispatchFeedback}
      editingActor={editingActor}
      editingMovie={editingMovie}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/movies"
          element={
            <Movies
              setEditingMovie={setEditingMovie}
              feedback={feedback}
              dispatchFeedback={dispatchFeedback}
            />
          }
        />
        <Route
          path="/actors"
          element={<Actors setEditingActor={setEditingActor} />}
        />
      </Routes>
    </Admin>
  ) : (
    <Routes>
      <Route
        path="/movies/:id"
        element={<MoviePage user={user} dispatchUser={dispatchUser} />}
      />
      <Route
        path="/movies/:id/reviews"
        element={<ReviewPage user={user} dispatchUser={dispatchUser} />}
      />
      <Route
        path="/actors/:id"
        element={<ActorPage user={user} dispatchUser={dispatchUser} />}
      />
      <Route
        path="/"
        element={
          <Home
            user={user}
            dispatchUser={dispatchUser}
            feedback={feedback}
            dispatchFeedback={dispatchFeedback}
          />
        }
      />
    </Routes>
  )
}
