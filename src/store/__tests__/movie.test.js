import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'
import movie from '../movie'

describe('movie store', () => {
  let store
  beforeEach(() => {
    store = cloneDeep(movie)
    store.state = movie.state()
    store.commit = function (name, payload) {
      store.mutations[name](store.state, payload)
    }
    store.dispatch = function (name, payload) {
      const context = {
        state: store.state,
        commit: store.commit,
        dispatch: store.dispatch
      }
      return store.actions[name](context, payload)
    }
  })
  test('state 업데이트', () => {
    /*
    const state = movie.state()
    movie.mutations.updateState(state, {
      loading: true,
    })
    expect(state.loading).toBe(true)
    */
    store.commit('updateState', { loading: true, movies: [1, 2, 3] })
    expect(store.state.loading).toBe(true)
    expect(store.state.movies).toEqual([1, 2, 3])
  })

  test('영화 목록에 push', () => {
    expect(store.state.movies).toEqual([])
    store.commit('pushIntoMovies', [{ Title: '영화제목' }])
    expect(store.state.movies).toEqual([{ Title: '영화제목' }])
  })

  test('영화 목록을 잘 가져왔을 때', async () => {
    const movie = {
      imdbID: '123456',
      Title: '영화 제목',
      Poster: 'image.jpg',
      Year: '2020'
    }
    axios.get = jest.fn().mockResolvedValue({
      data: {
        totalResults: '1',
        Search: [movie]
      }
    })
    await store.dispatch('searchMovies')
    expect(store.state.movies).toEqual([movie])
  })

  test('영화 목록을 가져오지 못했을 때', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error!'))
    await store.dispatch('searchMovies')
    expect(store.state.error).toEqual('Network Error!')
  })
})