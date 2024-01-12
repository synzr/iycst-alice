import {
  VERSTOV_GRAPHQL_ENDPOINT_URL,
  VERSTOV_GRAPHQL_OPERATION_NAME,
  VERSTOV_PAGE_CODE
} from '../assets/global-configuration.json'
import VERSTOV_GRAPHQL_VARIABLES from '../assets/verstov-graphql-variables.json'
import VERSTOV_GRAPHQL_QUERY from '../assets/verstov-graphql-query.txt'

function getCurrentDate (): string {
  const currentDate: Date = new Date()
  currentDate.setHours(0, 0, 0, 0)

  return currentDate.toISOString()
}

// NOTE: Based on https://github.com/adamschwartz/web.scraper.workers.dev/blob/master/scraper.js
function scrapeText (source: string): Promise<string> {
  function scrapeTextExecutor (
    resolve: Function,
    reject: Function
  ) {
    try {
      const onText = ({ text }: HTMLRewriterTypes.Text) => resolve(text)

      return new HTMLRewriter()
        .on('h2', { text: onText })
        .transform(source)
    } catch (error) {
      return reject(error)
    }
  }

  return new Promise(scrapeTextExecutor)
}

type ResponseData = {
  data: {
    post: { detailText: string }
  }
}

// FIXME(synzr): Pretty hacky GraphQL request... Move to actual client.
export function fetchText (): PromiseLike<string> {
  const requestData = {
    operationName: VERSTOV_GRAPHQL_OPERATION_NAME,
    variables: VERSTOV_GRAPHQL_VARIABLES,
    query: VERSTOV_GRAPHQL_QUERY
  }

  requestData.variables.where.code = VERSTOV_PAGE_CODE
  requestData.variables.moreWhere.activeFrom.gte = getCurrentDate()

  return fetch(
    VERSTOV_GRAPHQL_ENDPOINT_URL,
    {
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(requestData),
      method: 'POST'
    }
  )
    .then((response) => response.json())
    .then(
      (responseData) => {
        return scrapeText(
          (responseData as ResponseData).data.post.detailText
        )
      }
    )
}
