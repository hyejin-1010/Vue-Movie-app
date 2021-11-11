import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import store from '@/store'
import SearchBar from '../SearchBar.vue'

const localVue = createLocalVue()
localVue.use(Vuetify)

describe('SearchBar Componnet', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SearchBar, {
      localVue,
      store
    })
  })
  test ('제목을 입력했을 때 스토어 업데이트', () => {
    wrapper.vm.title = 'lion'
    expect(wrapper.vm.title).toBe('lion')
  })

  test('로딩 중 아이콘 확인', async () => { 
    wrapper.vm.$store.commit('movie/updateState', { loading: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })
})