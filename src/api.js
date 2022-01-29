import axios from 'axios'

const Api = () => {
  return axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const queryFetch = async (query, variables) => {
  return Api().post('/graphql', JSON.stringify({ query: query, variables: variables }))
}

export const searchCountryByName = (search) => {
  return queryFetch(
    `query searchCountryByName($name: String!) {
      countries : searchCountries(name: $name) {
        name, 
        population, 
        currency {
          code,
          name,
          symbol
        }
      }
    }`,
    { name: search }
  )
}

export const getExchangeRates = (symbols) => {
  return queryFetch(
    `query getExchangeRates($symbols: [String!]) {
      rates : getExchangeRates(symbols: $symbols) {
        code,
        rate
      }
    }`,
    { symbols: ['SEK', ...symbols] }
  )
}

export const login = async () => {
  const storedToken = localStorage.getItem('authToken')
  const { data } = storedToken
    ? await Api().get('/login', {
        headers: { Authorization: `Bearer ${JSON.parse(storedToken)}` },
      })
    : await Api().get('/login')

  const { token } = data
  localStorage.setItem('authToken', JSON.stringify(token))
  axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(storedToken)}`
}
